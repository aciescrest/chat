import { collections } from "$lib/server/database";
import { type Actions, fail, redirect } from "@sveltejs/kit";
import { ObjectId } from "mongodb";
import { authCondition } from "$lib/server/auth";
import { base } from "$app/paths";
import { env as envPublic } from "$env/dynamic/public";
import { env } from "$env/dynamic/private";
import { z } from "zod";
import { logger } from "$lib/server/logger";
import type { EHR } from "$lib/types/EHR";

export const load = async ({ params }) => {
	try {
		const assistant = await collections.EHR.findOne({
			_id: new ObjectId(params.ehrId),
		});

		if (!assistant) {
			redirect(302, `${base}`);
		}

		return { assistant: JSON.parse(JSON.stringify(assistant)) };
	} catch {
		redirect(302, `${base}`);
	}
};

async function assistantOnlyIfAuthor(locals: App.Locals, ehrId?: string) {
	const assistant = await collections.EHR.findOne({ _id: new ObjectId(ehrId) });

	if (!assistant) {
		throw Error("Assistant not found");
	}

	if (
		assistant.createdById.toString() !== (locals.user?._id ?? locals.sessionId).toString() &&
		!locals.user?.isAdmin
	) {
		throw Error("You are not the author of this assistant");
	}

	return assistant;
}

export const actions: Actions = {
	delete: async ({ params, locals }) => {
		let assistant;
		try {
			assistant = await assistantOnlyIfAuthor(locals, params.ehrId);
		} catch (e) {
			return fail(400, { error: true, message: (e as Error).message });
		}

		await collections.EHR.deleteOne({ _id: assistant._id });

		// and remove it from all users settings
		await collections.settings.updateMany(
			{
				ehrs: { $in: [assistant._id] },
			},
			{
				$pull: { ehrs: assistant._id },
			}
		);

		// and delete all avatars
		const fileCursor = collections.bucket.find({ filename: assistant._id.toString() });

		// Step 2: Delete the existing file if it exists
		let fileId = await fileCursor.next();
		while (fileId) {
			await collections.bucket.delete(fileId._id);
			fileId = await fileCursor.next();
		}

		redirect(302, `${base}/ehr`);
	},
	report: async ({ request, params, locals, url }) => {
		// is there already a report from this user for this model ?
		const report = await collections.reports.findOne({
			createdBy: locals.user?._id ?? locals.sessionId,
			object: "assistant",
			contentId: new ObjectId(params.assistantId),
		});

		if (report) {
			return fail(400, { error: true, message: "Already reported" });
		}

		const formData = await request.formData();
		const result = z.string().min(1).max(128).safeParse(formData?.get("reportReason"));

		if (!result.success) {
			return fail(400, { error: true, message: "Invalid report reason" });
		}

		const { acknowledged } = await collections.reports.insertOne({
			_id: new ObjectId(),
			contentId: new ObjectId(params.assistantId),
			object: "assistant",
			createdBy: locals.user?._id ?? locals.sessionId,
			createdAt: new Date(),
			updatedAt: new Date(),
			reason: result.data,
		});

		if (!acknowledged) {
			return fail(500, { error: true, message: "Failed to report assistant" });
		}

		if (env.WEBHOOK_URL_REPORT_ASSISTANT) {
			const prefixUrl =
				envPublic.PUBLIC_SHARE_PREFIX || `${envPublic.PUBLIC_ORIGIN || url.origin}${base}`;
			const assistantUrl = `${prefixUrl}/ehr/${params.assistantId}`;

			const assistant = await collections.EHR.findOne<Pick<EHR, "name">>(
				{ _id: new ObjectId(params.assistantId) },
				{ projection: { name: 1 } }
			);

			const username = locals.user?.username;

			const res = await fetch(env.WEBHOOK_URL_REPORT_ASSISTANT, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					text: `Assistant <${assistantUrl}|${assistant?.name}> reported by ${
						username ? `<http://hf.co/${username}|${username}>` : "non-logged in user"
					}.\n\n> ${result.data}`,
				}),
			});

			if (!res.ok) {
				logger.error(`Webhook assistant report failed. ${res.statusText} ${res.text}`);
			}
		}

		return { from: "report", ok: true, message: "Assistant reported" };
	},

	subscribe: async ({ params, locals }) => {
		const assistant = await collections.EHR.findOne({
			_id: new ObjectId(params.ehrId),
		});

		if (!assistant) {
			return fail(404, { error: true, message: "Assistant not found" });
		}

		// don't push if it's already there
		const settings = await collections.settings.findOne(authCondition(locals));

		if (settings?.ehrs?.includes(assistant._id)) {
			return fail(400, { error: true, message: "Already subscribed" });
		}

		const result = await collections.settings.updateOne(authCondition(locals), {
			$addToSet: { ehrs: assistant._id },
		});

		// reduce count only if push succeeded
		if (result.modifiedCount > 0) {
			await collections.EHR.updateOne({ _id: assistant._id }, { $inc: { userCount: 1 } });
		}

		return { from: "subscribe", ok: true, message: "EHR added" };
	},

	unsubscribe: async ({ params, locals }) => {
		const assistant = await collections.EHR.findOne({
			_id: new ObjectId(params.ehrId),
		});

		if (!assistant) {
			return fail(404, { error: true, message: "EHR not found" });
		}

		const result = await collections.settings.updateOne(authCondition(locals), {
			$pull: { ehrs: assistant._id },
		});

		// reduce count only if pull succeeded
		if (result.modifiedCount > 0) {
			await collections.EHR.updateOne({ _id: assistant._id }, { $inc: { userCount: -1 } });
		}

		redirect(302, `${base}/ehr`);
	},

	unfeature: async ({ params, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { error: true, message: "Permission denied" });
		}

		const assistant = await collections.EHR.findOne({
			_id: new ObjectId(params.ehrId),
		});

		if (!assistant) {
			return fail(404, { error: true, message: "EHR not found" });
		}

		const result = await collections.EHR.updateOne(
			{ _id: assistant._id },
			{ $set: { featured: false } }
		);

		if (result.modifiedCount === 0) {
			return fail(500, { error: true, message: "Failed to unfeature assistant" });
		}

		return { from: "unfeature", ok: true, message: "EHR unfeatured" };
	},

	feature: async ({ params, locals }) => {
		if (!locals.user?.isAdmin) {
			return fail(403, { error: true, message: "Permission denied" });
		}

		const assistant = await collections.EHR.findOne({
			_id: new ObjectId(params.ehrId),
		});

		if (!assistant) {
			return fail(404, { error: true, message: "EHR not found" });
		}

		const result = await collections.EHR.updateOne(
			{ _id: assistant._id },
			{ $set: { featured: true } }
		);

		if (result.modifiedCount === 0) {
			return fail(500, { error: true, message: "Failed to feature assistant" });
		}

		return { from: "feature", ok: true, message: "EHR featured" };
	},
};
