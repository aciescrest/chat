<script lang="ts">
	import type { ActionData, PageData } from "./$types";
	import AssistantSettings from "$lib/components/AssistantSettings.svelte";
	import AddEHR from "$lib/components/AddEHR.svelte"

	export let data: PageData;
	export let form: ActionData;
</script>

<AddEHR bind:form models={data.models} />
