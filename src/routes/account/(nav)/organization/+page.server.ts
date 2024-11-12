// import * as https from "https";
// import { base } from "$app/paths";
// import { env } from "$env/dynamic/private";
// import { Database, collections } from "$lib/server/database.js";
// import { SortKey, type Assistant } from "$lib/types/Assistant";
// import type { User } from "$lib/types/User";
// import { generateQueryTokens } from "$lib/utils/searchTokens.js";
import { error } from "@sveltejs/kit";
// import type { Filter } from "mongodb";
// import { SECRET_PAYSTACK_KEY } from "$env/static/private";
// import { fetchPaystackCustomer } from "$lib/server/customer";

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, "User not authenticated.");
	}

	// try {
	// 	const newCustomer = await createPaystackCustomer({
	// 		email: customerEmail,
	// 		first_name: customerNames[0],
	// 		last_name: customerNames[1],
	// 		phone: "+2348012345678",
	// 		// metadata: JSON.stringify({ source: 'website signup' }),
	// 	});
	// 	console.log("Customer created:", newCustomer.data.customer_code);
	// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	// } catch (error: any) {
	// 	// Should ideally be a custom error type if you create one
	// 	console.error("Error in example:", error.message);
	// }

	// const customerExists = await paystackCustomerExists(customerEmail);
	// console.log("Customer exists: ", customerExists);
};
