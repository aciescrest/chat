import axios from "axios";
import { error } from "@sveltejs/kit";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_SUBSCRIPTION_AMOUNT = process.env.PAYSTACK_SUBSCRIPTION_AMOUNT;
const PAYSTACK_API_URL = "https://api.paystack.co";
/* eslint-enable @typescript-eslint/no-non-null-assertion */
interface CustomerData {
	email?: string;
	first_name?: string;
	last_name?: string;
	phone?: string;
	metadata?: string; // You can use a more specific type if your metadata is structured
}

interface PaystackResponse {
	amount: number;
	status: boolean;
	message: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data: any; // Use a more specific type for the data if possible
}

interface PlanData {
	name: string;
	amount: number; // in kobo (e.g., 10000 for ₦100)
	interval: "hourly" | "daily" | "weekly" | "monthly" | "annually"; // Subscription interval
	description?: string;
	send_invoices?: boolean;
	send_sms?: boolean;
	currency?: string; // Defaults to NGN
	invoice_limit?: number; // Number of invoices to generate
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
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
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
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
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

/**
 * Subscribes a customer to a Paystack plan.
 *
 * @param customerCodeOrEmail The customer's code or email address.
 * @param planCode The Paystack plan code.
 * @returns The Paystack API response.
 * @throws Error if the subscription fails.
 */

/* eslint-enable @typescript-eslint/no-non-null-assertion */
export async function subscribeCustomerToPlan(
	customerCodeOrEmail: string | undefined,
	planCode: string | undefined
): Promise<PaystackResponse> {
	if (!customerCodeOrEmail || !planCode) {
		throw new Error("Customer identifier and plan code are required for subscription.");
	}

	try {
		const response = await axios.post<PaystackResponse>(
			`${PAYSTACK_API_URL}/subscription`,
			{
				customer: customerCodeOrEmail,
				plan: planCode,
				start_date: new Date().toISOString(),
			},
			{
				headers: {
					Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);
		await createPaystackPaymentPage({
			email: customerCodeOrEmail,
			plan: planCode,
			amount: Number(PAYSTACK_SUBSCRIPTION_AMOUNT),
		});
		return response.data;
	} catch (error: any) {
		const errorMessage = error.response
			? `Paystack Subscription Error: ${error.response.status} - ${JSON.stringify(
					error.response.data
			  )}`
			: `Paystack Subscription Error: ${error.message}`;
		console.error("Error subscribing customer:", errorMessage);
		throw new Error(errorMessage);
	}
}
/* eslint-enable @typescript-eslint/no-non-null-assertion */

/**
 * Creates a new subscription plan on Paystack.
 *
 * @param planData The plan data object.
 * @returns The Paystack API response.
 * @throws Error if plan creation fails.
 */
export async function createPaystackPlan(planData: PlanData): Promise<PaystackResponse> {
	if (!planData || !planData.name || !planData.amount || !planData.interval) {
		throw new Error("Name, amount, and interval are required to create a Paystack plan.");
	}

	try {
		const response = await axios.post<PaystackResponse>(`${PAYSTACK_API_URL}/plan`, planData, {
			headers: {
				Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
		});
		return response.data;
	} catch (error: any) {
		const errorMessage = error.response
			? `Paystack Plan Creation Error: ${error.response.status} - ${JSON.stringify(
					error.response.data
			  )}`
			: `Paystack Plan Creation Error: ${error.message}`;
		console.error("Error creating Paystack plan:", errorMessage);
		throw new Error(errorMessage);
	}
}

export interface PaystackPaymentPageData {
	email: string;
	plan: string;
	amount: number;
	channels?: string[]; // Defaults to NGN
	reference?: string; // Unique transaction reference (recommended)
	callback_url?: string; // URL to redirect to after payment
	metadata?: any; // Additional data to send to Paystack
}

/**
 * Creates a Paystack payment page.
 *
 * @param paymentData The payment page data.
 * @returns A URL to the Paystack payment page or throws an error.
 */
export async function createPaystackPaymentPage(
	paymentData: PaystackPaymentPageData
): Promise<string> {
	if (!paymentData.email || !paymentData.plan) {
		throw new Error("Email and plan are required to create a payment page.");
	}

	const requestData = {
		email: paymentData.email,
		plan: paymentData.plan,
		amount: paymentData.amount,
		channels: paymentData.channels || ["card", "bank", "mobile_money", "bank_transfer", "eft"],
		reference: paymentData.reference || generateReference(), // Generate if not provided
		callback_url: paymentData.callback_url, // Optional
		metadata: paymentData.metadata, // Optional
	};

	try {
		const response = await axios.post(`${PAYSTACK_API_URL}/transaction/initialize`, requestData, {
			headers: {
				Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
		});

		if (response.data.status && response.data.data && response.data.data.authorization_url) {
			return response.data.data.authorization_url;
		} else {
			throw new Error(`Paystack payment page creation failed: ${response.data.message}`);
		}
	} catch (error: any) {
		const errorMessage = error.response
			? `Paystack Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
			: `Paystack Error: ${error.message}`;

		console.error("Error creating Paystack payment page:", errorMessage);
		throw new Error(errorMessage);
	}
}

// Helper function to generate a unique reference (you can customize this)
function generateReference(): string {
	const timestamp = new Date().getTime().toString();
	const randomString = Math.random().toString(36).substring(2, 15); // Generate random part
	return `REF_${timestamp}_${randomString}`;
}

/* eslint-enable @typescript-eslint/no-explicit-any */
/* eslint-enable @typescript-eslint/no-non-null-assertion */
