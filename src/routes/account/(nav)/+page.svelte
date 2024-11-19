<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import CarbonClose from "~icons/carbon/close";
	import CarbonTrashCan from "~icons/carbon/trash-can";
	import CarbonArrowUpRight from "~icons/carbon/arrow-up-right";

	import { enhance } from "$app/forms";
	import { base } from "$app/paths";

	import { useSettingsStore } from "$lib/stores/settings";
	import Switch from "$lib/components/Switch.svelte";
	import { env as envPublic } from "$env/dynamic/public";
	import { datasets } from "cohere-ai/api";
	import type { PageData } from "./$types";

	let isConfirmingDeletion = false;

	export let data: PageData;

	let settings = useSettingsStore();
</script>

<div class="flex w-full flex-col gap-5">
	<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
		<h2>User Information</h2>
	</div>

	<div>
		<div class="mb-1 font-semibold">Name</div>
		<div class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2">
			{data?.user?.name}
		</div>
		<!-- <p class="text-xs text-red-500">{getError("name", form)}</p> -->
	</div>

	<div>
		<div class="mb-1 font-semibold">Email</div>
		<div class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2">
			{data?.user?.email}
		</div>
		<!-- <p class="text-xs text-red-500">{getError("name", form)}</p> -->
	</div>

	<div>
		<div class="mb-1 font-semibold">Customer Code</div>
		<div class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2">
			{data?.user?.customerCode}
		</div>
		<!-- <p class="text-xs text-red-500">{getError("name", form)}</p> -->
	</div>



    <!-- <div class="flex items-start justify-between text-xl font-semibold text-gray-800">
		<h2>Contact & Support</h2>
	</div> -->


</div>
