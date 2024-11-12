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

	<label>
		<div class="mb-1 font-semibold">Name</div>
		<input
			name="name"
			class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2"
			placeholder="Patient Name"
			value="Name"
		/>
		<!-- <p class="text-xs text-red-500">{getError("name", form)}</p> -->
	</label>

	<label>
		<div class="mb-1 font-semibold">Patient Demographics</div>
		<div
			class="mt-2 grid gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 px-2 py-0.5 pb-4 pt-4 text-sm md:grid-cols-2"
		>
			<div>
				<div class="mb-1">Age</div>
				<input
					type="number"
					name="age"
					placeholder=""
					value="None"
					class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2"
				/>
				<!-- <p class="text-xs text-red-500">{getError("age", form)}</p> -->
			</div>
			<div>
				<div class="mb-1">Gender</div>
				<select
					name="gender"
					class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2"
					value="Value"
				>
					<option value="Male">Male</option>
					<option value="Female">Female</option>
					<!-- <p class="text-xs text-red-500">{getError("gender", form)}</p> -->
				</select>
			</div>
			<div>
				<div class="mb-1">Phone Number</div>
				<input
					name="phoneNumber"
					placeholder=""
					value="Phone"
					class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2"
				/>
				<!-- <p class="text-xs text-red-500">{getError("phoneNumber", form)}</p> -->
			</div>
			<div>
				<div class="mb-1">Address</div>
				<input
					name="address"
					placeholder=" "
					value="Address"
					class="w-full rounded-lg border-2 border-gray-200 bg-transparent p-2"
				/>
				<!-- <p class="text-xs text-red-500">{getError("address", form)}</p> -->
			</div>
		</div>
	</label>




    <div class="flex items-start justify-between text-xl font-semibold text-gray-800">
		<h2>Transactions</h2>
	</div>


</div>