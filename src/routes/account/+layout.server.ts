import { collections } from "$lib/server/database";
import type { LayoutServerLoad } from "./$types";
import type { Report } from "$lib/types/Report";

export const load = (async ({ locals, parent }) => {
	const { assistants } = await parent();

	let reportsByUser: string[] = [];
	const createdBy = locals.user?._id ?? locals.sessionId;
	if (createdBy) {
		const reports = await collections.reports
			.find<Pick<Report, "contentId">>(
				{ createdBy, object: "assistant" },
				{ projection: { _id: 0, contentId: 1 } }
			)
			.toArray();
		reportsByUser = reports.map((r) => r.contentId.toString());
	}

	return {
		assistants: assistants.map((el) => ({
			...el,
			reported: reportsByUser.includes(el._id),
		})),
		user: {
			name: locals?.user?.name,
			email: locals?.user?.email,
			customerCode: locals?.user?.customerCode,
		},
	};
}) satisfies LayoutServerLoad;
