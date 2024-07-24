import { isURLLocal } from "../isURLLocal";
import { ENABLE_LOCAL_FETCH, ENABLE_ASSISTANTS_RAG } from "$env/static/private";
import { collections } from "$lib/server/database";
import type { Assistant } from "$lib/types/Assistant";
import type { ObjectId } from "mongodb";

export async function processPreprompt(preprompt: string) {
	const urlRegex = /{{\s?url=(.*?)\s?}}/g;

	for (const match of preprompt.matchAll(urlRegex)) {
		try {
			const url = new URL(match[1]);
			if ((await isURLLocal(url)) && ENABLE_LOCAL_FETCH !== "true") {
				throw new Error("URL couldn't be fetched, it resolved to a local address.");
			}

			const res = await fetch(url.href);

			if (!res.ok) {
				throw new Error("URL couldn't be fetched, error " + res.status);
			}
			const text = await res.text();
			preprompt = preprompt.replaceAll(match[0], text);
		} catch (e) {
			preprompt = preprompt.replaceAll(match[0], (e as Error).message);
		}
	}

	return preprompt;
}

export async function getAssistantById(id?: ObjectId) {
	return collections.assistants
		.find<Pick<Assistant, "rag" | "dynamicPrompt" | "generateSettings">>(
			{ _id: id },
			{ projection: { rag: 1, dynamicPrompt: 1, generateSettings: 1 } }
		).limit(1)
		.next(
			// (a) => a ?? undefined
		);
}

export function assistantHasWebSearch(assistant?: Pick<Assistant, "rag"> | null) {
	return (
		ENABLE_ASSISTANTS_RAG === "true" &&
		!!assistant?.rag &&
		(assistant.rag.allowedLinks.length > 0 ||
			assistant.rag.allowedDomains.length > 0 ||
			assistant.rag.allowAllDomains)
	);
}

export function assistantHasDynamicPrompt(assistant?: Pick<Assistant, "dynamicPrompt">) {
	return ENABLE_ASSISTANTS_RAG === "true" && Boolean(assistant?.dynamicPrompt);
}
