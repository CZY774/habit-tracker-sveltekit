<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { habits } from '$lib/stores/habits';
	import HabitForm from '$lib/components/HabitForm.svelte';
	import HabitList from '$lib/components/HabitList.svelte';
	import ProgressChart from '$lib/components/ProgressChart.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { Target, Sparkles, Instagram, Github, Globe } from 'lucide-svelte';

	let selectedDate: string = new Date().toLocaleDateString('sv-SE');
	let activeTab: 'habits' | 'progress' = 'habits';

	onMount(() => {
		habits.init();

		if ('Notification' in window && window.Notification.permission === 'default') {
			window.Notification.requestPermission();
		}
	});

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);

		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	$: formattedDayLabel = (() => {
		const todayStr = new Date().toLocaleDateString('sv-SE');

		// debug today's date raw format
		const todayRaw = new Date().toISOString();
		console.log("Today's date (raw):", todayRaw);

		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const yesterdayStr = yesterday.toLocaleDateString('sv-SE');

		const selected = new Date(selectedDate);
		const weekday = selected.toLocaleDateString('en-US', { weekday: 'long' });

		if (selectedDate === todayStr) {
			return `Today - ${weekday}`;
		} else if (selectedDate === yesterdayStr) {
			return `Yesterday - ${weekday}`;
		} else {
			return weekday;
		}
	})();
</script>

<svelte:head>
	<title>Habit Tracker - Build Better Habits</title>
	<meta name="description" content="Track your daily habits and build a better lifestyle" />
</svelte:head>

<div
	class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:text-white"
>
	<!-- Header -->
	<header
		class="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="mx-auto max-w-4xl px-4 py-4">
			<div class="flex items-center justify-between">
				<!-- Logo & Title -->
				<div class="flex items-center gap-3">
					<div
						class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-2 dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500"
					>
						<Target class="text-white" size={24} />
					</div>
					<div>
						<h1
							class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-blue-400 dark:to-purple-500"
						>
							Habit Tracker
						</h1>
						<p class="text-sm text-gray-600 dark:text-gray-400">
							Build better habits, one day at a time
						</p>
					</div>
				</div>

				<!-- Date Display -->
				<div class="text-right">
					<p class="text-lg font-semibold text-gray-800 dark:text-gray-200">
						{formatDate(selectedDate)}
					</p>
					<p class="text-sm text-gray-600 dark:text-gray-400">
						{formattedDayLabel}
					</p>
				</div>
			</div>

			<!-- Tab Navigation -->
			<div class="mt-4 flex space-x-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
				<button
					class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {activeTab ===
					'habits'
						? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400'
						: 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200'}"
					on:click={() => (activeTab = 'habits')}
					aria-pressed={activeTab === 'habits'}
					aria-label="Switch to Habits Tab"
				>
					<Target size={16} />
					Habits
				</button>
				<button
					class="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 {activeTab ===
					'progress'
						? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800 dark:text-blue-400'
						: 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200'}"
					on:click={() => (activeTab = 'progress')}
					aria-pressed={activeTab === 'progress'}
					aria-label="Switch to Progress Tab"
				>
					<Sparkles size={16} />
					Progress
				</button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto max-w-4xl px-4 py-8">
		{#if activeTab === 'habits'}
			<!-- Habits Tab -->
			<div class="space-y-6">
				<!-- Add Habit Form -->
				<HabitForm {selectedDate} />

				<!-- Habit List -->
				<HabitList bind:selectedDate />
			</div>
		{:else if activeTab === 'progress'}
			<!-- Progress Tab -->
			<div class="space-y-6">
				<ProgressChart />
			</div>
		{/if}
	</main>

	<!-- Footer -->
	<footer
		class="mt-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800"
	>
		<div class="mx-auto max-w-4xl px-4 py-8">
			<div class="text-center">
				<p class="mb-2 text-gray-600 dark:text-gray-400">
					Created by <span class="font-semibold">Cornelius Yoga</span>
				</p>
				<p class="text-sm text-gray-500 dark:text-gray-400">
					Track your progress, celebrate small wins, and build lasting change.
				</p>
				<!-- sosial media icons: instagram, github, portfolio web -->
				<div class="mt-4 flex justify-center">
					<a
						href="https://instagram.com/corneliusyoga"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Visit Cornelius Yoga's Instagram profile"
						class="mr-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
					>
						<Instagram size={24} />
					</a>
					<a
						href="https://github.com/corneliusyoga"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Visit Cornelius Yoga's GitHub profile"
						class="mr-4 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
					>
						<Github size={24} />
					</a>
					<a
						href="https://corneliusyoga.vercel.app/"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Visit Cornelius Yoga's Portfolio"
						class="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
					>
						<Globe size={24} />
					</a>
				</div>
			</div>
		</div>
	</footer>

	<!-- Notification Component -->
	<Notification />
</div>
