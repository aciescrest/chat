import type { LayoutServerLoad } from "./$types";
import { collections } from "$lib/server/database";
import type { Conversation } from "$lib/types/Conversation";
import { UrlDependency } from "$lib/types/UrlDependency";
import { defaultModel, models, oldModels, validateModel } from "$lib/server/models";
import { authCondition, requiresUser } from "$lib/server/auth";
import { DEFAULT_SETTINGS } from "$lib/types/Settings";
import { env } from "$env/dynamic/private";
import { ObjectId } from "mongodb";
import type { ConvSidebar } from "$lib/types/ConvSidebar";
import { toolFromConfigs } from "$lib/server/tools";
import { MetricsServer } from "$lib/server/metrics";
import type { ToolFront, ToolInputFile } from "$lib/types/Tool";
import {
	createPaystackCustomer,
	createPaystackPaymentPage,
	createPaystackPlan,
	fetchPaystackCustomer,
	paystackCustomerExists,
	subscribeCustomerToPlan,
	type PaystackPaymentPageData,
} from "$lib/server/customer";

export const load: LayoutServerLoad = async ({ locals, depends, request }) => {
	depends(UrlDependency.ConversationList);

	const settings = await collections.settings.findOne(authCondition(locals));

	// If the active model in settings is not valid, set it to the default model. This can happen if model was disabled.
	if (
		settings &&
		!validateModel(models).safeParse(settings?.activeModel).success &&
		!settings.assistants?.map((el) => el.toString())?.includes(settings?.activeModel) &&
		!settings.ehrs?.map((el) => el.toString())?.includes(settings?.activeModel)
	) {
		settings.activeModel = defaultModel.id;
		await collections.settings.updateOne(authCondition(locals), {
			$set: { activeModel: defaultModel.id },
		});
	}

	// if the model is unlisted, set the active model to the default model
	if (
		settings?.activeModel &&
		models.find((m) => m.id === settings?.activeModel)?.unlisted === true
	) {
		settings.activeModel = defaultModel.id;
		await collections.settings.updateOne(authCondition(locals), {
			$set: { activeModel: defaultModel.id },
		});
	}

	const enableAssistants = env.ENABLE_ASSISTANTS === "true";

	const assistantActive = !models.map(({ id }) => id).includes(settings?.activeModel ?? "");

	const assistant = assistantActive
		? JSON.parse(
				JSON.stringify(
					await collections.assistants.findOne({
						_id: new ObjectId(settings?.activeModel),
					})
				)
		  )
		: null;

	const ehr = assistantActive
		? JSON.parse(
				JSON.stringify(
					await collections.EHR.findOne({
						_id: new ObjectId(settings?.activeModel),
					})
				)
		  )
		: null;

	const conversations = await collections.conversations
		.find(authCondition(locals))
		.sort({ updatedAt: -1 })
		.project<
			Pick<
				Conversation,
				"title" | "model" | "_id" | "updatedAt" | "createdAt" | "assistantId" | "ehrId"
			>
		>({
			title: 1,
			model: 1,
			_id: 1,
			updatedAt: 1,
			createdAt: 1,
			assistantId: 1,
			ehrId: 1,
		})
		.limit(300)
		.toArray();

	const userAssistants = settings?.assistants?.map((assistantId) => assistantId.toString()) ?? [];
	const userEHR = settings?.ehrs?.map((ehrId) => ehrId.toString()) ?? [];

	const userAssistantsSet = new Set(userAssistants);
	const userEHRSet = new Set(userEHR);

	const assistantIds = [
		...userAssistants.map((el) => new ObjectId(el)),
		...(conversations.map((conv) => conv.assistantId).filter((el) => !!el) as ObjectId[]),
	];

	const ehrIds = [
		...userEHR.map((el) => new ObjectId(el)),
		...(conversations.map((conv) => conv.ehrId).filter((el) => !!el) as ObjectId[]),
	];

	const assistants = await collections.assistants.find({ _id: { $in: assistantIds } }).toArray();
	const ehrs = await collections.EHR.find({ _id: { $in: ehrIds } }).toArray();

	const messagesBeforeLogin = env.MESSAGES_BEFORE_LOGIN ? parseInt(env.MESSAGES_BEFORE_LOGIN) : 0;

	let loginRequired = false;

	if (requiresUser && !locals.user && messagesBeforeLogin) {
		if (conversations.length > messagesBeforeLogin) {
			loginRequired = true;
		} else {
			// get the number of messages where `from === "assistant"` across all conversations.
			const totalMessages =
				(
					await collections.conversations
						.aggregate([
							{ $match: { ...authCondition(locals), "messages.from": "assistant" } },
							{ $project: { messages: 1 } },
							{ $limit: messagesBeforeLogin + 1 },
							{ $unwind: "$messages" },
							{ $match: { "messages.from": "assistant" } },
							{ $count: "messages" },
						])
						.toArray()
				)[0]?.messages ?? 0;

			loginRequired = totalMessages > messagesBeforeLogin;
		}
	}

	const toolUseDuration = (await MetricsServer.getMetrics().tool.toolUseDuration.get()).values;

	const configToolIds = toolFromConfigs.map((el) => el._id.toString());

	const activeCommunityToolIds = (settings?.tools ?? []).filter(
		(key) => !configToolIds.includes(key)
	);

	const communityTools = await collections.tools
		.find({ _id: { $in: activeCommunityToolIds.map((el) => new ObjectId(el)) } })
		.toArray()
		.then((tools) =>
			tools.map((tool) => ({
				...tool,
				isHidden: false,
				isOnByDefault: true,
				isLocked: true,
			}))
		);
	/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
	const appConfigs = await collections.appConfigs.find({}).toArray();
	/* eslint-disable @typescript-eslint/no-explicit-any */

	const PAYSTACK_SUBSCRIPTION_NAME = process.env.PAYSTACK_SUBSCRIPTION_NAME;
	const PAYSTACK_SUBSCRIPTION_AMOUNT = process.env.PAYSTACK_SUBSCRIPTION_AMOUNT;
	const PAYSTACK_SUBSCRIPTION_CURRENCY = process.env.PAYSTACK_SUBSCRIPTION_CURRENCY;

	/* eslint-disable @typescript-eslint/no-non-null-assertion */

	const paystackPlan = appConfigs.find((a) => a.name === PAYSTACK_SUBSCRIPTION_NAME);

	// Free Trial Logic
	const FREE_TRIAL_DAYS = 7; // Set the duration of your free trial (in days)
	let isFreeTrialActive = false;
	let freeTrialEndDate: Date | null = null;

	if (locals?.user) {
		// Check if the user has a freeTrialEndDate property
		if (locals.user.freeTrialEndDate) {
			freeTrialEndDate = new Date(locals.user.freeTrialEndDate);
			isFreeTrialActive = freeTrialEndDate > new Date();
		} else {
			// If not, set it to now + FREE_TRIAL_DAYS
			freeTrialEndDate = new Date();
			freeTrialEndDate.setDate(freeTrialEndDate.getDate() + FREE_TRIAL_DAYS);
			isFreeTrialActive = true;

			await collections.users.updateOne(
				{ _id: locals.user._id },
				{ $set: { freeTrialEndDate: freeTrialEndDate.toISOString() } }
			);
		}
	}

	if (!paystackPlan) {
		try {
			const response = await createPaystackPlan({
				name: PAYSTACK_SUBSCRIPTION_NAME!,
				interval: "monthly",
				amount: +PAYSTACK_SUBSCRIPTION_AMOUNT!,
				currency: PAYSTACK_SUBSCRIPTION_CURRENCY,
			});
			if (response.data) {
				await collections.appConfigs.insertOne(response.data);
			}
		} catch (error: any) {
			// Should ideally be a custom error type if you create one
			console.error("Error in example:", error.message);
		}
	}

	/* eslint-disable @typescript-eslint/no-non-null-assertion */

	/* eslint-disable @typescript-eslint/no-explicit-any */

	const customerEmail = locals?.user?.email;

	let paymentPrompt = false;

	let paystackPaymentPageUrl = "";

	let paymentDefault = false;

	if (locals?.user && !isFreeTrialActive) {
		const paystackCustomerReg = customerEmail ? await paystackCustomerExists(customerEmail) : false;

		if (!paystackCustomerReg && customerEmail) {
			const customerNames = locals?.user?.name ? locals?.user?.name.split(/\s+/) : ["J", "Doe"];
			try {
				const newCustomer = await createPaystackCustomer({
					email: customerEmail,
					first_name: customerNames[0],
					last_name: customerNames[1],
					phone: "+2348012345678",
					// metadata: JSON.stringify({ source: 'website signup' }),
				});

				await createPaystackPaymentPage({
					email: customerEmail,
					plan: paystackPlan?.plan_code!,
					amount: +PAYSTACK_SUBSCRIPTION_AMOUNT!,
					callback_url: "https://care.aciescrest.com/",
				})
					.then((paymentPageUrl: string) => {
						// Redirect the user to the payment page URL
						paymentPrompt = true;
						paystackPaymentPageUrl = paymentPageUrl; // Or open in a new window/tab
					})
					.catch((error) => {
						// Handle the error (e.g., display an error message to the user)

						throw error(401, "There was an error generating payment details.");
					});

				await subscribeCustomerToPlan(customerEmail, paystackPlan?.plan_code);
				if (newCustomer) {
					// update existing user if any
					await collections.users.updateOne(
						{ _id: locals?.user?._id },
						{ $set: { customerCode: newCustomer.data.customer_code } }
					);
				}
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				// Should ideally be a custom error type if you create one
				console.error("Error in example:", error.message);
			}
		}

		/* eslint-disable @typescript-eslint/no-non-null-assertion */

		if (paystackCustomerReg) {
			const fetchedCustomer = await fetchPaystackCustomer(customerEmail!);

			const subs = fetchedCustomer.data.subscriptions;
			const paystackSubscription = subs.find(
				(a: any) => a.amount === +PAYSTACK_SUBSCRIPTION_AMOUNT!
			);

			if (paystackSubscription) {
				const currentDate = new Date();
				const nextPaystackPaymentDate = new Date(paystackSubscription.next_payment_date);

				if (currentDate > nextPaystackPaymentDate) {
					paymentDefault = true;
				} else if (nextPaystackPaymentDate > currentDate) {
					paymentDefault = false;
				} else {
					paymentDefault = true;
				}
			} else if (!paystackSubscription) {
				await subscribeCustomerToPlan(locals?.user?.email, paystackPlan?.plan_code);
			}
		}

		/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

		if (paymentDefault) {
			const paymentData: PaystackPaymentPageData = {
				email: locals?.user?.email!,
				plan: paystackPlan?.plan_code!,
				amount: 500000,
				callback_url: "https://care.aciescrest.com/",
			};

			await createPaystackPaymentPage(paymentData)
				.then((paymentPageUrl: string) => {
					// Redirect the user to the payment page URL
					paystackPaymentPageUrl = paymentPageUrl; // Or open in a new window/tab
				})
				.catch((error) => {
					// Handle the error (e.g., display an error message to the user)

					throw error(401, "There was an error generating payment details.");
				});
		}
		/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

		/* eslint-disable @typescript-eslint/no-non-null-assertion */
	}

	return {
		conversations: conversations.map((conv) => {
			if (settings?.hideEmojiOnSidebar) {
				conv.title = conv.title.replace(/\p{Emoji}/gu, "");
			}

			// remove invalid unicode and trim whitespaces
			conv.title = conv.title.replace(/\uFFFD/gu, "").trimStart();

			return {
				id: conv._id.toString(),
				title: conv.title,
				model: conv.model ?? defaultModel,
				updatedAt: conv.updatedAt,
				assistantId: conv.assistantId?.toString(),
				avatarHash:
					conv.assistantId &&
					assistants.find((a) => a._id.toString() === conv.assistantId?.toString())?.avatar,
				ehrId: conv.ehrId?.toString(),
			};
		}) satisfies ConvSidebar[],
		settings: {
			searchEnabled: !!(
				env.SERPAPI_KEY ||
				env.SERPER_API_KEY ||
				env.SERPSTACK_API_KEY ||
				env.SEARCHAPI_KEY ||
				env.YDC_API_KEY ||
				env.USE_LOCAL_WEBSEARCH ||
				env.SEARXNG_QUERY_URL ||
				env.BING_SUBSCRIPTION_KEY
			),
			ethicsModalAccepted: !!settings?.ethicsModalAcceptedAt,
			ethicsModalAcceptedAt: settings?.ethicsModalAcceptedAt ?? null,
			activeModel: settings?.activeModel ?? DEFAULT_SETTINGS.activeModel,
			hideEmojiOnSidebar: settings?.hideEmojiOnSidebar ?? false,
			shareConversationsWithModelAuthors:
				settings?.shareConversationsWithModelAuthors ??
				DEFAULT_SETTINGS.shareConversationsWithModelAuthors,
			customPrompts: settings?.customPrompts ?? {},
			assistants: userAssistants,
			tools:
				settings?.tools ??
				toolFromConfigs
					.filter((el) => !el.isHidden && el.isOnByDefault)
					.map((el) => el._id.toString()),
			disableStream: settings?.disableStream ?? DEFAULT_SETTINGS.disableStream,
			ehrs: userEHR,
		},
		models: models.map((model) => ({
			id: model.id,
			name: model.name,
			websiteUrl: model.websiteUrl,
			modelUrl: model.modelUrl,
			tokenizer: model.tokenizer,
			datasetName: model.datasetName,
			datasetUrl: model.datasetUrl,
			displayName: model.displayName,
			description: model.description,
			logoUrl: model.logoUrl,
			promptExamples: model.promptExamples,
			parameters: model.parameters,
			preprompt: model.preprompt,
			multimodal: model.multimodal,
			tools:
				model.tools &&
				// disable tools on huggingchat android app
				!request.headers.get("user-agent")?.includes("co.huggingface.chat_ui_android"),
			unlisted: model.unlisted,
		})),
		oldModels,
		tools: [...toolFromConfigs, ...communityTools]
			.filter((tool) => !tool?.isHidden)
			.map(
				(tool) =>
					({
						_id: tool._id.toString(),
						type: tool.type,
						displayName: tool.displayName,
						name: tool.name,
						description: tool.description,
						mimeTypes: (tool.inputs ?? [])
							.filter((input): input is ToolInputFile => input.type === "file")
							.map((input) => (input as ToolInputFile).mimeTypes)
							.flat(),
						isOnByDefault: tool.isOnByDefault ?? true,
						isLocked: tool.isLocked ?? true,
						timeToUseMS:
							toolUseDuration.find(
								(el) => el.labels.tool === tool._id.toString() && el.labels.quantile === 0.9
							)?.value ?? 15_000,
					} satisfies ToolFront)
			),
		communityToolCount: await collections.tools.countDocuments({ type: "community" }),
		assistants: assistants
			.filter((el) => userAssistantsSet.has(el._id.toString()))
			.map((el) => ({
				...el,
				_id: el._id.toString(),
				createdById: undefined,
				createdByMe:
					el.createdById.toString() === (locals.user?._id ?? locals.sessionId).toString(),
			})),
		ehrs: ehrs
			.filter((el) => userEHRSet.has(el._id.toString()))
			.map((el) => ({
				...el,
				_id: el._id.toString(),
				createdById: undefined,
				createdByMe:
					el.createdById.toString() === (locals.user?._id ?? locals.sessionId).toString(),
			})),
		user: locals.user && {
			id: locals.user._id.toString(),
			username: locals.user.name,
			avatarUrl: locals.user.avatarUrl,
			email: locals.user.email,
			logoutDisabled: locals.user.logoutDisabled,
			isAdmin: locals.user.isAdmin ?? false,
			isEarlyAccess: locals.user.isEarlyAccess ?? false,
		},
		assistant,
		ehr,
		enableAssistants,
		enableAssistantsRAG: env.ENABLE_ASSISTANTS_RAG === "true",
		enableCommunityTools: env.COMMUNITY_TOOLS === "true",
		loginRequired,
		loginEnabled: requiresUser,
		guestMode: requiresUser && messagesBeforeLogin > 0,
		paystackCustomerExists: customerEmail ? await paystackCustomerExists(customerEmail) : false,
		paymentPrompt,
		paystackPaymentPageUrl,
		isFreeTrialActive, // Include free trial status in the return object
		freeTrialEndDate: freeTrialEndDate?.toISOString() ?? null, // Include free trial end date
	};
};
