import axios from "axios";
import { error } from "@sveltejs/kit";

const SECRET_PAYSTACK_KEY = process.env.SECRET_PAYSTACK_KEY; // Replace with your actual secret key
const PAYSTACK_API_URL = "https://api.paystack.co";

interface CustomerData {
	email: string;
	first_name?: string;
	last_name?: string;
	phone?: string;
	metadata?: string; // You can use a more specific type if your metadata is structured
}

interface PaystackResponse {
	status: boolean;
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any; // Use a more specific type for the data if possible
}

/**
 * Creates a new customer on Paystack.
 *
 * @param customerData - The customer data object.
 * @returns The Paystack API response or throws an error.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function createPaystackCustomer(
	customerData: CustomerData
): Promise<PaystackResponse> {
	if (!customerData || !customerData.email) {
		throw error(404, "Email is required to create a Paystack customer.");
	}

	try {
		const response = await axios.post<PaystackResponse>(
			`${PAYSTACK_API_URL}/customer`,
			customerData,
			{
				headers: {
					Authorization: `Bearer ${SECRET_PAYSTACK_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		return response.data;
	} catch (error: any) {
		// Use 'any' for now but ideally type the error more specifically if possible (e.g. AxiosError)
		const errorMessage = error.response
			? `Paystack API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
			: `Paystack API Error: ${error.message}`;
		console.error("Error creating Paystack customer:", errorMessage);
		throw new Error(errorMessage);
	}
}

/**
 * Fetches a customer from Paystack by their email or code.
 *
 * @param identifier - The customer's email or code.
 * @returns The Paystack API response or throws an error.
 */
export async function fetchPaystackCustomer(identifier: string): Promise<PaystackResponse> {
	if (!identifier) {
		throw new Error("An email or customer code is required to fetch a Paystack customer.");
	}

	try {
		const response = await axios.get<PaystackResponse>(
			`${PAYSTACK_API_URL}/customer/${identifier}`,
			{
				headers: {
					Authorization: `Bearer ${SECRET_PAYSTACK_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);
		return response.data;
	} catch (error: any) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const errorMessage = error.response
			? `Paystack API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
			: `Paystack API Error: ${error.message}`;

		console.error(`Error fetching Paystack customer ${identifier}:`, errorMessage);
		throw new Error(errorMessage); // Re-throw the error for the calling function to handle
	}
}

/**
 * Checks if a Paystack customer exists by email.
 * @param email The customer's email address.
 * @returns True if the customer exists, false otherwise.
 */
export async function paystackCustomerExists(email: string): Promise<boolean> {
	if (!email) {
		throw new Error("Email is required to check for customer existence.");
	}

	try {
		const response = await fetchPaystackCustomer(email);
		// Paystack returns status true even if customer doesn't exist, but data is null
		return response.status && response.data !== null && Object.keys(response.data).length > 0;
	} catch (error: any) {
		if (error.message.includes("404")) {
			// Paystack returns 404 when customer isn't found.
			return false;
		}
		console.error(`Error checking Paystack customer existence: ${error.message}`);
		throw error; // Re-throw the error for other issues.
	}
}

/* eslint-enable @typescript-eslint/no-explicit-any */
