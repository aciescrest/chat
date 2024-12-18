import { base } from "$app/paths";
import { env } from "$env/dynamic/private";
import { Database, collections } from "$lib/server/database.js";
import { SortKey } from "$lib/types/Assistant";
import type { EHR } from "$lib/types/EHR.js";
import type { User } from "$lib/types/User";
import { error, redirect } from "@sveltejs/kit";
import type { ObjectIdLike } from "bson";
import { ObjectId, type Filter } from "mongodb";

const NUM_PER_PAGE = 24;

export const load = async ({ url, locals }) => {
	if (!env.ENABLE_ASSISTANTS) {
		redirect(302, `${base}/`);
	}

	const modelId = url.searchParams.get("modelId");
	// const pageIndex = parseInt(url.searchParams.get("p") ?? "0");
	const username = url.searchParams.get("user");
	const query = url.searchParams.get("q")?.trim() ?? null;
	const sort = url.searchParams.get("sort")?.trim() ?? SortKey.TRENDING;
	// const createdByCurrentUser = locals.user?.username && locals.user.username === username;
	const showUnfeatured = url.searchParams.get("showUnfeatured") === "true";

	let user: Pick<User, "_id"> | null = null;
	if (username) {
		user = await collections.users.findOne<Pick<User, "_id">>(
			{ username },
			{ projection: { _id: 1 } }
		);
		if (!user) {
			error(404, `User "${username}" doesn't exist`);
		}
	}

	// if there is no user, we show community assistants, so only show featured assistants
	// const shouldBeFeatured =
	// 	env.REQUIRE_FEATURED_ASSISTANTS === "true" && !user && !(locals.user?.isAdmin && showUnfeatured)
	// 		? { featured: true }
	// 		: {};

	// if the user queried is not the current user, only show "public" assistants that have been shared before
	// const shouldHaveBeenShared =
	// 	env.REQUIRE_FEATURED_ASSISTANTS === "true" && !createdByCurrentUser && !locals.user?.isAdmin
	// 		? { userCount: { $gt: 1 } }
	// 		: {};

	// fetch EHRs created by the currently logged-in user
	async function fetchUserEHRs(
		userId: string | number | ObjectIdLike | ObjectId | Uint8Array | undefined
	) {
		// Add userId as a parameter
		const filter: Filter<EHR> = {
			createdById: new ObjectId(userId), // Filter by userId
		};

		try {
			const assistants = await Database.getInstance()
				.getCollections()
				.EHR.find(filter)
				.sort({ _id: -1 }) // Sort by creation date (newest first), you can change it to other sort criteria
				.toArray();

			return assistants;
		} catch (error) {
			console.error("Error fetching user EHRs:", error);
			return []; // Return an empty array in case of an error
		}
	}

	const assistants = await fetchUserEHRs(locals.user?._id);

	const filter: Filter<EHR> = {
		createdById: new ObjectId(user?._id), // Filter by userId
	};

	// console.log(assistants);

	// fetch the top EHR sorted by user count from biggest to smallest. filter by model too if modelId is provided or query if query is provided
	// const filter: Filter<EHR> = {
	// 	...(modelId && { modelId }),
	// 	...(user && { createdById: user._id }),
	// 	...(query && { searchTokens: { $all: generateQueryTokens(query) } }),
	// 	...shouldBeFeatured,
	// 	...shouldHaveBeenShared,
	// };
	// const assistants = await Database.getInstance()
	// 	.getCollections()
	// 	.EHR.find(filter)
	// 	.sort({
	// 		...(sort === SortKey.TRENDING && { last24HoursCount: -1 }),
	// 		userCount: -1,
	// 		_id: 1,
	// 	})
	// 	.skip(NUM_PER_PAGE * pageIndex)
	// 	.limit(NUM_PER_PAGE)
	// 	.toArray();

	const numTotalItems = await Database.getInstance().getCollections().EHR.countDocuments(filter);

	return {
		assistants: JSON.parse(JSON.stringify(assistants)) as Array<EHR>,
		selectedModel: modelId ?? "",
		numTotalItems,
		numItemsPerPage: NUM_PER_PAGE,
		query,
		sort,
		showUnfeatured,
	};
};
