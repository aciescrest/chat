<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import CarbonClose from "~icons/carbon/close";
	import CarbonWallet from "~icons/carbon/wallet";
	import CarbonArrowUpRight from "~icons/carbon/arrow-up-right";

	import { enhance } from "$app/forms";
	import { base } from "$app/paths";

	import { useSettingsStore } from "$lib/stores/settings";
	import Switch from "$lib/components/Switch.svelte";
	import { env as envPublic } from "$env/dynamic/public";
	import type { PageData } from "./$types";
	import { page } from "$app/stores";

	let isConfirmingDeletion = false;

	let settings = useSettingsStore();

	export let data: PageData;

	let customerEmail = data?.user?.email;

	if (!customerEmail) {
		customerEmail = data?.user?.id + "@email.com";
	}

	export let customer = data.customer;

	const subs = customer.data.subscriptions;
	const paystackSubscription = subs.find((a: any) => a.amount === 500000);
	// export let subscription = data.paystackSubscription;
</script>

<div class="flex w-full flex-col gap-5">
	<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
		<h2>Payments</h2>
	</div>

	<div>
		<div class="mb-1 font-semibold">Subscription Name</div>
		<div class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2">
			EHR Management & Healthcare Administration Application
		</div>

		<!-- <p class="text-xs text-red-500">{getError("name", form)}</p> -->
	</div>

	<div>
		<div class="mb-1 font-semibold">Information</div>
		<div
			class="mt-2 grid gap-1.5 rounded-lg border border-blue-500/20 bg-blue-200/5 px-2 py-0.5 pb-4 pt-4 text-sm md:grid-cols-2"
		>
			<div>
				<div class="mb-1">Amount</div>
				<div class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2">{paystackSubscription.amount/100}</div>
				<!-- <p class="text-xs text-red-500">{getError("age", form)}</p> -->
			</div>
			<div>
				<div class="mb-1">Next Payment</div>
				<div class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2">{new Date(paystackSubscription.next_payment_date).toDateString()}</div>
				<!-- <p class="text-xs text-red-500">{getError("age", form)}</p> -->
			</div>
			<div>
				<div class="mb-1">Status</div>
				<div class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2">{paystackSubscription.status}</div>
				<!-- <p class="text-xs text-red-500">{getError("age", form)}</p> -->
			</div>
			<div>
				<div class="mb-1">Created At</div>
				<div class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2">{new Date(paystackSubscription.createdAt).toDateString()}</div>
				<!-- <p class="text-xs text-red-500">{getError("age", form)}</p> -->
			</div>
		</div>

		<!-- <div>
			<button
			class="bg-blue-200 mt-5 group flex h-10 flex-none items-center gap-2 pl-3 pr-2 text-sm text-gray-500 hover:bg-blue-100 md:rounded-xl"
			><CarbonWallet class="mr-1.5 shrink-0 text-xs " />
			<div class="truncate">Make Payment</div>
		</button>
		</div> -->
	</div>

	<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
		<h2>Transactions</h2>
	</div>
</div>
