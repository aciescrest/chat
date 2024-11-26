<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { base } from "$app/paths";
	import { goto } from "$app/navigation";
	import type { Model } from "$lib/types/Model";
	import type { Assistant } from "$lib/types/Assistant";
	import { useSettingsStore } from "$lib/stores/settings";
	import { formatUserCount } from "$lib/utils/formatUserCount";
	import IconGear from "~icons/bi/gear-fill";
	import IconInternet from "../components/icons/IconInternet.svelte";
	import CarbonExport from "~icons/carbon/export";
	import CarbonCheckmark from "~icons/carbon/checkmark";
	import CarbonRenew from "~icons/carbon/renew";
	import CarbonTrash from "~icons/carbon/trash-can";
	import CarbonPen from "~icons/carbon/pen";
	import CarbonUserMultiple from "~icons/carbon/user-multiple";
	import CarbonTools from "~icons/carbon/tools";
	import { applyAction, enhance } from "$app/forms";

	import { share } from "$lib/utils/share";
	import { env as envPublic } from "$env/dynamic/public";
	import { page } from "$app/stores";
	import type { EHR } from "$lib/types/EHR";

	// export let models: Model[];
	export let assistant: Pick<
		EHR,
		| "avatar"
		| "name"
		| "rag"
		| "dynamicPrompt"
		| "createdByName"
		| "exampleInputs"
		| "_id"
		| "description"
		| "userCount"
		| "tools"
		| "featured"
		| "address"
		| "age"
		| "gender"
		| "phoneNumber"
		| "medicalHistory"
		| "medicalNotes"
		| "vitalSigns"
		| "medicationList"
		| "labTestResults"
	>;

	const dispatch = createEventDispatcher<{ message: string }>();

	$: hasRag =
		assistant?.rag?.allowAllDomains ||
		(assistant?.rag?.allowedDomains?.length ?? 0) > 0 ||
		(assistant?.rag?.allowedLinks?.length ?? 0) > 0 ||
		assistant?.dynamicPrompt;

	const prefix =
		envPublic.PUBLIC_SHARE_PREFIX || `${envPublic.PUBLIC_ORIGIN || $page.url.origin}${base}`;

	$: shareUrl = `${prefix}/ehr/${assistant?._id}`;

	let isCopied = false;

	const settings = useSettingsStore();
</script>

<div class="scrollbar-custom mr-1 h-full overflow-y-auto py-12 pl-5 pr-5 max-sm:pt-8 md:py-24">
	<div
		class="relative mt-auto rounded-2xl bg-gray-100 text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300"
	>
		<div
			class="mt-3 flex min-w-[80dvw] items-center gap-4 p-4 pr-1 sm:min-w-[440px] md:p-8 xl:gap-8 pt-12"
		>
			{#if assistant.avatar}
				<img
					src={`${base}/ehr/${assistant._id.toString()}/avatar.jpg?hash=${assistant.avatar}`}
					alt="avatar"
					class="size-16 md:size-32 flex-none rounded-full object-cover max-sm:self-start"
				/>
			{:else}
				<div
					class="size-12 md:size-32 flex flex-none items-center justify-center rounded-full bg-gray-300 object-cover text-xl font-bold uppercase text-gray-500 dark:bg-gray-600 max-sm:self-start sm:text-4xl"
				>
					{assistant?.name[0]}
				</div>
			{/if}

			<div class="text-balance flex h-full flex-col gap-2">
				<p class="-mb-1">Patient Record</p>

				<p class="text-xl font-bold sm:text-2xl">{assistant.name}</p>
				{#if assistant.description}
					<p class="line-clamp-6 text-sm text-gray-500 dark:text-gray-400">
						{assistant.description}
					</p>
				{/if}

				<!-- {#if assistant?.tools?.length}
					<div
						class="flex h-5 w-fit items-center gap-1 rounded-full bg-purple-500/10 pl-1 pr-2 text-xs"
						title="This assistant uses the websearch."
					>
						<CarbonTools class="text-sm text-purple-600" />
						Has tools
					</div>
				{/if} -->
				<!-- {#if hasRag}
					<div
						class="flex h-5 w-fit items-center gap-1 rounded-full bg-blue-500/10 pl-1 pr-2 text-xs"
						title="This assistant uses the websearch."
					>
						<IconInternet classNames="text-sm text-blue-600" />
						Has internet access
					</div>
				{/if} -->

				{#if assistant.createdByName}
					<p class="pt-1 text-sm text-gray-400 dark:text-gray-500">
						Created by
						<a class="hover:underline" href="{base}/ehr?user={assistant.createdByName}">
							{assistant.createdByName}
						</a>
						<!-- {#if assistant.userCount && assistant.userCount > 1}
							<span class="mx-1">·</span>
							<div
								class="inline-flex items-baseline gap-1 text-sm text-gray-400 dark:text-gray-500"
								title="Number of users"
							>
								<CarbonUserMultiple class="text-xxs" />{formatUserCount(assistant.userCount)} users
							</div>
						{/if} -->
					</p>
				{/if}
			</div>
		</div>

		<div class="absolute right-3 top-3 md:right-4 md:top-4">
			<div class="flex flex-row items-center gap-1">
				<button
					class="flex h-7 items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-gray-800 shadow-sm hover:shadow-inner dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300/90 dark:hover:bg-gray-800 max-sm:px-1.5 md:text-sm"
					on:click={() => {
						if (!isCopied) {
							share(shareUrl, assistant.name);
							isCopied = true;
							setTimeout(() => {
								isCopied = false;
							}, 2000);
						}
					}}
				>
					{#if isCopied}
						<CarbonCheckmark class="text-xxs text-green-600 max-sm:text-xs" />
						<span class="text-green-600 max-sm:hidden"> Coming Soon </span>
					{:else}
						<CarbonExport class="text-xxs max-sm:text-xs" />
						<span class="max-sm:hidden"> Export </span>
					{/if}
				</button>
				<a
					href="{base}/ehr/{assistant._id.toString()}/edit"
					class="flex h-7 items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-gray-800 shadow-sm hover:shadow-inner dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300/90 dark:hover:bg-gray-800 md:text-sm"
					><CarbonPen class="mr-1.5 inline text-xs" />Edit</a
				>
				<form method="POST" action="?/delete" use:enhance>
					<button
						type="submit"
						class="flex h-7 items-center gap-1.5 rounded-full border bg-white px-2.5 py-1 text-gray-800 shadow-sm hover:shadow-inner dark:border-gray-700 dark:bg-gray-700 dark:text-gray-300/90 dark:hover:bg-gray-800 md:text-sm"
					>
						<CarbonTrash class="mr-1.5 inline text-xs" />Delete</button
					>
				</form>
			</div>
		</div>
		<!-- <button
			on:click={() => {
				settings.instantSet({
					activeModel: models[0].name,
				});
				goto(`${base}/`);
			}}
			class="absolute -bottom-6 right-2 inline-flex items-center justify-center text-xs text-gray-600 underline hover:brightness-50 dark:text-gray-400 dark:hover:brightness-110"
		>
			<CarbonRenew class="text-xxs mr-1.5" /> Perform document analysis
		</button> -->
		{#if $settings.ehrs.includes(assistant._id.toString())}
			<button
				class="absolute -bottom-6 right-2 inline-flex items-center justify-center text-xs text-gray-600 underline hover:brightness-50 dark:text-gray-400 dark:hover:brightness-110"
				on:click={() => {
					if ($page.data.settings.ehrs.includes(assistant._id.toString())) {
						settings.instantSet({ activeModel: assistant._id.toString() });
						goto(`${base}` || "/");
					} else {
						goto(`${base}/ehr/${assistant._id}`);
					}
				}}
			>
			<CarbonTools class="text-xxs mr-1.5" /> Perform document analysis
			</button>
		{/if}

		{#if !$settings.ehrs.includes(assistant._id.toString())}
			<form
				method="POST"
				action="{base}/ehr/{$page.data.assistant._id}?/subscribe"
				class="w-full"
				use:enhance={() => {
					return async ({ result }) => {
						// `result` is an `ActionResult` object
						if (result.type === "success") {
							$settings.activeModel = $page.data.assistant._id;
							goto(`${base}` || "/");
						} else {
							await applyAction(result);
						}
					};
				}}
			>
				<button type="submit" class="absolute -bottom-6 right-2 inline-flex items-center justify-center text-xs text-gray-600 underline hover:brightness-50 dark:text-gray-400 dark:hover:brightness-110">
					<CarbonTools class="text-xxs mr-1.5" /> Perform document analysis
				</button>
			</form>
		{/if}
	</div>

	<dl class="mt-8 grid grid-cols-1 gap-3 sm:gap-5 xl:grid-cols-2">
		<div
			class="relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-gray-50/50 px-6 py-5 shadow hover:bg-gray-50 hover:shadow-inner dark:border-gray-800/70 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
		>
			<div class="flex items-center justify-between gap-1">
				<div
					class="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-500 dark:text-gray-400"
				>
					Patient Demographics
				</div>
			</div>
			<dd class="whitespace-pre-wrap text-sm">
				Age: {assistant?.age}
			</dd>
			<dd class="whitespace-pre-wrap text-sm">
				Address: {assistant?.address}
			</dd>
			<dd class="whitespace-pre-wrap text-sm">
				Gender: {assistant?.gender}
			</dd>
			<dd class="whitespace-pre-wrap text-sm">
				Phone Number: {assistant?.phoneNumber}
			</dd>
		</div>

		<div
			class="relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-gray-50/50 px-6 py-5 shadow hover:bg-gray-50 hover:shadow-inner dark:border-gray-800/70 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
		>
			<div class="flex items-center justify-between gap-1">
				<div
					class="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-500 dark:text-gray-400"
				>
					Medical History
				</div>
			</div>
			<!-- <dt class="flex items-center gap-2 font-semibold">
				{assistant?.medicalHistory}
			</dt> -->
			<dd class="whitespace-pre-wrap text-sm">
				{assistant?.medicalHistory}
			</dd>
		</div>

		<div
			class="relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-gray-50/50 px-6 py-5 shadow hover:bg-gray-50 hover:shadow-inner dark:border-gray-800/70 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
		>
			<div class="flex items-center justify-between gap-1">
				<div
					class="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-500 dark:text-gray-400"
				>
					Medication List
				</div>
			</div>
			<!-- <dt class="flex items-center gap-2 font-semibold">
				{assistant?.medicalHistory}
			</dt> -->
			<dd class="whitespace-pre-wrap text-sm">
				{assistant?.medicationList}
			</dd>
		</div>

		<div
			class="relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-gray-50/50 px-6 py-5 shadow hover:bg-gray-50 hover:shadow-inner dark:border-gray-800/70 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
		>
			<div class="flex items-center justify-between gap-1">
				<div
					class="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-500 dark:text-gray-400"
				>
					Vital Signs
				</div>
			</div>
			<!-- <dt class="flex items-center gap-2 font-semibold">
				{assistant?.medicalHistory}
			</dt> -->
			<dd class="whitespace-pre-wrap text-sm">
				{assistant?.medicalHistory}
			</dd>
		</div>

		<div
			class="relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-gray-50/50 px-6 py-5 shadow hover:bg-gray-50 hover:shadow-inner dark:border-gray-800/70 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
		>
			<div class="flex items-center justify-between gap-1">
				<div
					class="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-500 dark:text-gray-400"
				>
					Laboratory Test Results
				</div>
			</div>
			<!-- <dt class="flex items-center gap-2 font-semibold">
				{assistant?.medicalHistory}
			</dt> -->
			<dd class="whitespace-pre-wrap text-sm">
				{assistant?.labTestResults}
			</dd>
		</div>

		<div
			class="relative flex flex-col gap-2 overflow-hidden rounded-xl border bg-gray-50/50 px-6 py-5 shadow hover:bg-gray-50 hover:shadow-inner dark:border-gray-800/70 dark:bg-gray-950/20 dark:hover:bg-gray-950/40"
		>
			<div class="flex items-center justify-between gap-1">
				<div
					class="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-500 dark:border-gray-500 dark:text-gray-400"
				>
					Medical Notes and Visits
				</div>
			</div>
			<!-- <dt class="flex items-center gap-2 font-semibold">
				{assistant?.medicalHistory}
			</dt> -->
			{#if assistant?.medicalNotes}
				{#each assistant.medicalNotes as { note, visitDate }}
					<div class="mb-2 rounded-lg border p-2">
						<p class="mb-1 font-medium">
							{new Date(visitDate).toLocaleString()}
						</p>
						<p>{note}</p>
					</div>
				{/each}
			{/if}
		</div>
	</dl>
</div>
