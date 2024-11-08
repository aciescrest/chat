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

	let isConfirmingDeletion = false;

	let settings = useSettingsStore();
</script>

<div class="flex w-full flex-col gap-5">
	<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
		<h2>Payments</h2>
	</div>



    <div class="flex items-start justify-between text-xl font-semibold text-gray-800">
		<h2>Transactions</h2>
	</div>


</div>