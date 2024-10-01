<script lang="ts">
	import type { PageData, ActionData } from "../$types";
	import { page } from "$app/stores";
	import AddEHR from "$lib/components/AddEHR.svelte";

	export let data: PageData;
	export let form: ActionData;

	let assistant = data.assistant;
</script>

<AddEHR bind:form {assistant} models={data.models} />
