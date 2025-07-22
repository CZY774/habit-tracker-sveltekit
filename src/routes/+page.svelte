<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { habits } from '$lib/stores/habits';
	import HabitForm from '$lib/components/HabitForm.svelte';
	import HabitList from '$lib/components/HabitList.svelte';
	import ProgressChart from '$lib/components/ProgressChart.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { Target, Sparkles, Instagram, Github, Globe } from 'lucide-svelte';

	let selectedDate: string = new Date().toISOString().split('T')[0];
	let activeTab: 'habits' | 'progress' = 'habits';

	onMount(() => {
		habits.init();

		if ('Notification' in window && Notification.permission === 'default') {
			Notification.requestPermission();
		}
	});

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		const today = new Date();
		const yesterday = new Date();
		yesterday.setDate(today.getDate() - 1);

		const isToday = dateStr === today.toISOString().split('T')[0];
		const isYesterday = dateStr === yesterday.toISOString().split('T')[0];

		if (isToday) return 'Hari Ini';
		if (isYesterday) return 'Kemarin';

		return date.toLocaleDateString('id-ID', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>


<svelte:head>
    <title>Habit Tracker - Build Better Habits</title>
    <meta name="description" content="Track your daily habits and build a better lifestyle" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="max-w-4xl mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <!-- Logo & Title -->
                <div class="flex items-center gap-3">
                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-500">
                        <Target class="text-white" size={24} />
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-500">
                            Habit Tracker
                        </h1>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Build better habits, one day at a time</p>
                    </div>
                </div>

                <!-- Date Display -->
                <div class="text-right">
                    <p class="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        {formatDate(selectedDate)}
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}
                    </p>
                </div>
            </div>

            <!-- Tab Navigation -->
            <div class="flex space-x-1 mt-4 bg-gray-100 rounded-xl p-1 dark:bg-gray-700">
                <button
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {activeTab === 'habits' ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800' : 'text-gray-600 hover:text-gray-800 dark:text-gray-300'}"
                    on:click={() => activeTab = 'habits'}
                >
                    <Target size={16} />
                    Kebiasaan
                </button>
                <button
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 {activeTab === 'progress' ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-800' : 'text-gray-600 hover:text-gray-800 dark:text-gray-300'}"
                    on:click={() => activeTab = 'progress'}
                >
                    <Sparkles size={16} />
                    Progress
                </button>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 py-8">
        {#if activeTab === 'habits'}
            <!-- Habits Tab -->
            <div class="space-y-6">
                <!-- Add Habit Form -->
                <HabitForm />
                
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
    <footer class="mt-16 bg-white/50 backdrop-blur-sm border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="max-w-4xl mx-auto px-4 py-8">
            <div class="text-center">
                <p class="text-gray-600 mb-2 dark:text-gray-400">
                    Created by <span class="font-semibold">Cornelius Yoga</span>
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    Track your progress, celebrate small wins, and build lasting change.
                </p>
                <!-- sosial media icons: instagram, github, portfolio web -->
                <div class="flex justify-center mt-4">
                    <a href="https://instagram.com/corneliusyoga" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800 mr-4 dark:text-gray-300 dark:hover:text-gray-200">
                        <Instagram size={24} />
                    </a>
                    <a href="https://github.com/corneliusyoga" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800 mr-4 dark:text-gray-300 dark:hover:text-gray-200">
                        <Github size={24} />
                    </a>
                    <a href="https://corneliusyoga.vercel.app/" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-200">
                        <Globe size={24} />
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Notification Component -->
    <Notification />
</div>