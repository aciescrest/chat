import { WebSearchProvider, type WebSearchSource } from "$lib/types/WebSearch";
import { 
	YDC_API_KEY, 
	SEARXNG_QUERY_URL,
	USE_LOCAL_WEBSEARCH,
	SERPER_API_KEY,
	SERPAPI_KEY,
	SERPSTACK_API_KEY,
	SEARCHAPI_KEY
} from "$env/static/private";
import searchSerper from "./endpoints/serper";
import searchSerpApi from "./endpoints/serpApi";
import searchSerpStack from "./endpoints/serpStack";
import searchYouApi from "./endpoints/youApi";
import searchWebLocal from "./endpoints/webLocal";
import searchSearxng from "./endpoints/searxng";
import searchSearchApi from "./endpoints/searchApi";

export function getWebSearchProvider() {
	if (YDC_API_KEY) return WebSearchProvider.YOU;
	if (SEARXNG_QUERY_URL) return WebSearchProvider.SEARXNG;
	return WebSearchProvider.GOOGLE;
}

/** Searches the web using the first available provider, based on the env */
export async function searchWeb(query: string): Promise<WebSearchSource[]> {
	if (USE_LOCAL_WEBSEARCH) return searchWebLocal(query);
	if (SEARXNG_QUERY_URL) return searchSearxng(query);
	if (SERPER_API_KEY) return searchSerper(query);
	if (YDC_API_KEY) return searchYouApi(query);
	if (SERPAPI_KEY) return searchSerpApi(query);
	if (SERPSTACK_API_KEY) return searchSerpStack(query);
	if (SEARCHAPI_KEY) return searchSearchApi(query);
	throw new Error(
		"No configuration found for web search. Please set USE_LOCAL_WEBSEARCH, SEARXNG_QUERY_URL, SERPER_API_KEY, YDC_API_KEY, SERPSTACK_API_KEY, or SEARCHAPI_KEY in your environment variables."
	);
}
