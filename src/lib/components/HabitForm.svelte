<script lang="ts">
	import { habits, addNotification } from '../stores/habits';
	import { Plus } from 'lucide-svelte';

	let habitName: string = '';
	let category: string = 'health';
	let isAdding: boolean = false;

	const categories: { value: string; label: string; color: string }[] = [
		{ value: 'health', label: '🏃 Health', color: 'bg-green-500' },
		{ value: 'learning', label: '📚 Learning', color: 'bg-blue-500' },
		{ value: 'work', label: '💼 Work', color: 'bg-purple-500' },
		{ value: 'hobby', label: '🎨 Hobby', color: 'bg-orange-500' },
		{ value: 'social', label: '👥 Social', color: 'bg-pink-500' },
		{ value: 'general', label: '⭐ General', color: 'bg-gray-500' }
	];

	async function handleSubmit() {
		if (!habitName.trim()) return;

		isAdding = true;

		setTimeout(() => {
			habits.addHabit(habitName, category);
			addNotification(`🎉 Habit "${habitName}" successfully added!`);

			habitName = '';
			category = 'health';
			isAdding = false;
		}, 300);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}
</script>

<div class="mb-6 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-gray-200">
	<h2 class="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200">
		<Plus class="text-blue-500 dark:text-blue-400" size={24} />
		Add New Habit
	</h2>

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<!-- Input Nama Habit -->
		<div>
			<label
				for="habit-name"
				class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
			>
			</label>
			<input
				id="habit-name"
				type="text"
				bind:value={habitName}
				on:keydown={handleKeydown}
				placeholder="e.g. Exercise for 30 minutes"
				class="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-transparent dark:focus:ring-blue-400"
				disabled={isAdding}
			/>
		</div>

		<!-- Pilih Kategori -->
		<div>
			<label for="category" class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
				Category
			</label>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-3">
				{#each categories as cat}
					<label class="relative cursor-pointer">
						<input
							type="radio"
							bind:group={category}
							value={cat.value}
							class="sr-only"
							disabled={isAdding}
						/>
						<div
							class="rounded-lg border-2 p-3 transition-all duration-200 {category === cat.value
								? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900'
								: 'border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-500'}"
						>
							<div class="text-sm font-medium text-gray-800 dark:text-gray-200">
								{cat.label}
							</div>
						</div>
					</label>
				{/each}
			</div>
		</div>

		<!-- Submit Button -->
		<button
			type="submit"
			disabled={!habitName.trim() || isAdding}
			class="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 dark:from-blue-600 dark:to-purple-700 dark:text-white dark:shadow-md dark:hover:from-blue-700 dark:hover:to-purple-800 disabled:dark:from-gray-600 disabled:dark:to-gray-700 disabled:dark:text-gray-300 {isAdding
				? 'scale-95'
				: ''}"
		>
			{#if isAdding}
				<div class="flex items-center justify-center gap-2">
					<div
						class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-200"
					></div>
					Menambahkan...
				</div>
			{:else}
				<div class="flex items-center justify-center gap-2">
					<Plus size={20} />
					Add Habit
				</div>
			{/if}
		</button>
	</form>
</div>

<style>
	.animate-spin {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
