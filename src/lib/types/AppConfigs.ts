import type { ObjectId } from "mongodb";
import type { Timestamps } from "./Timestamps";

export interface AppConfigs extends Timestamps {
	_id: ObjectId;

	name: string;
	interval: string;
	amount: number;
	integration: number;
	domain: string;
	currency: string;
	plan_code: string;
	invoice_limit: number;
	send_invoices: boolean;
	send_sms: boolean;
	hosted_page: boolean;
	migrate: boolean;
	is_archived: boolean;
	id: number;
}
