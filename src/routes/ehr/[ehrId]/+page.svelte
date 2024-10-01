<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { base } from "$app/paths";
	import { goto } from "$app/navigation";
	import type { Model } from "$lib/types/Model";
	import { useSettingsStore } from "$lib/stores/settings";

	import type { PageData } from "./$types";

	import { share } from "$lib/utils/share";
	import { env as envPublic } from "$env/dynamic/public";
	import { page } from "$app/stores";
	import type { EHR } from "$lib/types/EHR";
	import EhrDetails from "$lib/components/EHRDetails.svelte";

	export let models: Model[];
	export let data: PageData;

	export let assistant = data.assistant;

	const dispatch = createEventDispatcher<{ message: string }>();

	$: hasRag =
		assistant?.rag?.allowAllDomains ||
		(assistant?.rag?.allowedDomains?.length ?? 0) > 0 ||
		(assistant?.rag?.allowedLinks?.length ?? 0) > 0 ||
		assistant?.dynamicPrompt;

	const prefix =
		envPublic.PUBLIC_SHARE_PREFIX || `${envPublic.PUBLIC_ORIGIN || $page.url.origin}${base}`;

	$: shareUrl = `${prefix}/assistant/${assistant?._id}`;

	let isCopied = false;
	let loginModalOpen = false;

	const settings = useSettingsStore();
</script>

<EhrDetails
	{models}
	{assistant}
	on:message={(ev) => {
		if ($page.data.loginRequired) {
			ev.preventDefault();
			loginModalOpen = true;
		} else {
			dispatch("message", ev.detail);
		}
	}}
/>
