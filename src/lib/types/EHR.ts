import type { ObjectId } from "mongodb";
import type { User } from "./User";
import type { Timestamps } from "./Timestamps";

export interface EHR extends Timestamps {
	_id: ObjectId;
	createdById: User["_id"] | string; // user id or session
	createdByName?: User["username"];
	avatar?: string;
	name: string;
	age: number;
	gender: string;
	phoneNumber: string;
	address: string;
	medicalHistory?: string;
	medicationList?: string;
	vitalSigns?: string;
	labTestResults?: string;
	medicalNotes?: { note: string; visitDate: string | Date }[];

	description?: string;
	exampleInputs: string[];
	preprompt: string;
	userCount?: number;
	featured?: boolean;
	rag?: {
		allowAllDomains: boolean;
		allowedDomains: string[];
		allowedLinks: string[];
	};
	dynamicPrompt?: boolean;
	searchTokens: string[];
	last24HoursCount: number;
	tools?: string[];
}

// eslint-disable-next-line no-shadow
export enum SortKey {
	POPULAR = "popular",
	TRENDING = "trending",
}
