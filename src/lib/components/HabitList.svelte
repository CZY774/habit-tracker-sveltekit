<script lang="ts">
	import { habits, addNotification } from '../stores/habits';
	import { CheckCircle, Circle, Trash2, Calendar, Flame } from 'lucide-svelte';
	import type { Habit } from '../stores/habits';

	export let selectedDate: string = new Date().toISOString().split('T')[0];

	// Tambahkan variabel untuk tracking celebration
	let celebratingHabits = new Set<string>();

	$: sortedHabits = [...$habits].sort(
		(a: Habit, b: Habit) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

	const categoryConfig: Record<string, { label: string; color: string }> = {
		health: {
			label: '🏃 Health',
			color: 'from-green-400 to-green-600 dark:from-green-600 dark:to-green-800'
		},
		learning: {
			label: '📚 Learning',
			color: 'from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800'
		},
		work: {
			label: '💼 Work',
			color: 'from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800'
		},
		hobby: {
			label: '🎨 Hobby',
			color: 'from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800'
		},
		social: {
			label: '👥 Social',
			color: 'from-pink-400 to-pink-600 dark:from-pink-600 dark:to-pink-800'
		},
		general: {
			label: '⭐ General',
			color: 'from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-800'
		}
	};

	function toggleHabit(habitId: string, habitName: string) {
		habits.toggleCompletion(habitId, selectedDate);

		const habit = $habits.find((h) => h.id === habitId);
		const isCompleted = habit?.completions[selectedDate];

		if (isCompleted) {
			// Tampilkan celebration (tidak perlu setTimeout lagi)
			const newSet = new Set(celebratingHabits);
			newSet.add(habitId);
			celebratingHabits = newSet;

			addNotification(`✅ "${habitName}" is completed!`, 'success');

			if (Notification.permission === 'granted') {
				new Notification('Habit Completed! 🎉', {
					body: `Great job completing "${habitName}"!`,
					icon: '/favicon.svg'
				});
			}
		} else {
			// Hapus celebration jika di-uncheck
			const newSet = new Set(celebratingHabits);
			newSet.delete(habitId);
			celebratingHabits = newSet;

			addNotification(`↩️ "${habitName}" dibatalkan`, 'info');
		}
	}

	function removeHabit(id: string, name: string) {
		if (confirm(`Yakin ingin menghapus habit "${name}"?`)) {
			// Hapus dari celebrating habits juga
			const newSet = new Set(celebratingHabits);
			newSet.delete(id);
			celebratingHabits = newSet;

			habits.removeHabit(id);
			addNotification(`🗑️ Habit "${name}" is removed`, 'warning');
		}
	}

	// Fungsi untuk mengecek apakah habit sedang celebrating
	function isCelebrating(habitId: string): boolean {
		return celebratingHabits.has(habitId);
	}

	function getStreak(habit: Habit): number {
		let streak = 0;
		let currentDate = new Date();

		while (true) {
			const dateStr = currentDate.toISOString().split('T')[0];
			if (habit.completions[dateStr]) {
				streak++;
				currentDate.setDate(currentDate.getDate() - 1);
			} else {
				break;
			}
		}

		return streak;
	}

	function getCompletionRate(habit: Habit): number {
		const total = Object.keys(habit.completions).length;
		const daysSinceCreated =
			Math.ceil(
				(new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
			) + 1;
		return Math.round((total / Math.max(daysSinceCreated, 1)) * 100);
	}
</script>

<div class="space-y-4">
	<!-- Header dengan Date Picker -->
	<div class="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800 dark:text-gray-200">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-200">
				<Calendar class="text-blue-500 dark:text-blue-400" size={24} />
				Today's Habits
			</h2>
			<div class="flex items-center gap-2">
				<label for="date-picker" class="hidden text-sm text-gray-600 sm:block dark:text-gray-300">
					Pick Date:
				</label>
				<input
					id="date-picker"
					type="date"
					bind:value={selectedDate}
					class="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400"
					max={new Date().toISOString().split('T')[0]}
				/>
			</div>
		</div>

		{#if sortedHabits.length === 0}
			<div class="py-12 text-center">
				<div class="mb-4 text-6xl">🎯</div>
				<h3 class="mb-2 text-lg font-semibold text-gray-700 dark:text-gray-200">No Habits Yet</h3>
				<p class="text-gray-500 dark:text-gray-400">Add your first habit to get started!</p>
			</div>
		{:else}
			<div class="grid gap-4">
				{#each sortedHabits as habit (habit.id)}
					{@const isCompleted = habit.completions[selectedDate]}
					{@const streak = getStreak(habit)}
					{@const completionRate = getCompletionRate(habit)}
					{@const category = categoryConfig[habit.category] || categoryConfig.general}

					<div
						class="group relative bg-gradient-to-r {category.color} rounded-xl p-[2px] transition-all duration-300 hover:scale-[1.02]"
					>
						<div class="h-full rounded-[10px] bg-white p-4 dark:bg-gray-800">
							<div class="flex items-center justify-between">
								<div class="flex flex-1 items-center gap-3">
									<!-- Checkbox Button -->
									<button
										on:click={() => toggleHabit(habit.id, habit.name)}
										class="flex-shrink-0 transition-all duration-300 hover:scale-110 {isCompleted
											? 'text-green-500 dark:text-green-400'
											: 'text-gray-400 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400'}"
									>
										{#if isCompleted}
											<CheckCircle size={28} class="drop-shadow-sm" />
										{:else}
											<Circle size={28} />
										{/if}
									</button>

									<!-- Habit Info -->
									<div class="flex-1">
										<h3
											class="font-semibold text-gray-800 dark:text-gray-200 {isCompleted
												? 'text-gray-500 line-through dark:text-gray-400'
												: ''}"
										>
											{habit.name}
										</h3>
										<div
											class="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400"
										>
											<span class="flex items-center gap-1">
												<div class="h-2 w-2 rounded-full bg-gradient-to-r {category.color}"></div>
												{category.label}
											</span>
											{#if streak > 0}
												<span class="flex items-center gap-1 text-orange-500 dark:text-orange-400">
													<Flame size={14} />
													{streak} days
												</span>
											{/if}
											<span class="text-blue-500 dark:text-blue-400">
												{completionRate}% completed
											</span>
										</div>
									</div>
								</div>

								<!-- Delete Button -->
								<button
									on:click={() => removeHabit(habit.id, habit.name)}
									class="flex-shrink-0 rounded-lg p-2 text-gray-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-600 dark:hover:text-red-400"
								>
									<Trash2 size={18} />
								</button>
							</div>

							<!-- Completion Animation -->
							{#if isCelebrating(habit.id)}
								<div class="celebration-container">
									<div class="celebration-particle"></div>
									<div class="celebration-particle"></div>
									<div class="celebration-particle"></div>
									<div class="celebration-particle"></div>
									<div class="celebration-particle"></div>
									<div class="sparkle"></div>
									<div class="sparkle"></div>
									<div class="sparkle"></div>
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Stats Summary -->
	{#if sortedHabits.length > 0}
		{@const todayCompletions = sortedHabits.filter((h) => h.completions[selectedDate]).length}
		{@const totalHabits = sortedHabits.length}
		{@const completionPercentage = Math.round((todayCompletions / totalHabits) * 100)}

		<div
			class="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white dark:from-blue-600 dark:to-purple-700"
		>
			<div class="text-center">
				<div class="mb-2 text-3xl font-bold">{completionPercentage}%</div>
				<div class="mb-1 text-blue-100 dark:text-blue-200">Today's Progress</div>
				<div class="text-sm text-blue-200 dark:text-blue-300">
					{todayCompletions} of {totalHabits} habits completed
				</div>
			</div>

			<!-- Progress Bar -->
			<div class="mt-4 h-2 rounded-full bg-blue-400/30 dark:bg-blue-600/30">
				<div
					class="h-2 rounded-full bg-white transition-all duration-1000 ease-out dark:bg-blue-200"
					style="width: {completionPercentage}%"
				></div>
			</div>
		</div>
	{/if}
</div>

<style>
	.celebration-container {
		position: absolute;
		inset: 0;
		pointer-events: none;
		overflow: hidden;
		border-radius: 10px;
	}

	.celebration-particle {
		position: absolute;
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	/* Animasi dengan peak di 50-60% lalu auto hide di 100% */
	.celebration-particle:nth-child(1) {
		background: linear-gradient(45deg, #10b981, #34d399);
		top: 20%;
		left: 20%;
		animation: celebrate-1 1.5s ease-out forwards;
	}

	.celebration-particle:nth-child(2) {
		background: linear-gradient(45deg, #3b82f6, #60a5fa);
		top: 30%;
		right: 20%;
		animation: celebrate-2 1.6s ease-out 0.1s forwards;
	}

	.celebration-particle:nth-child(3) {
		background: linear-gradient(45deg, #f59e0b, #fbbf24);
		bottom: 30%;
		left: 30%;
		animation: celebrate-3 1.4s ease-out 0.2s forwards;
	}

	.celebration-particle:nth-child(4) {
		background: linear-gradient(45deg, #ef4444, #f87171);
		bottom: 20%;
		right: 30%;
		animation: celebrate-4 1.7s ease-out 0.15s forwards;
	}

	.celebration-particle:nth-child(5) {
		background: linear-gradient(45deg, #8b5cf6, #a78bfa);
		top: 50%;
		left: 50%;
		animation: celebrate-center 1.3s ease-out forwards;
	}

	.sparkle {
		position: absolute;
		width: 4px;
		height: 4px;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 0 6px #fff;
	}

	.sparkle:nth-child(6) {
		top: 25%;
		left: 60%;
		animation: sparkle 1.2s ease-out 0.3s forwards;
	}

	.sparkle:nth-child(7) {
		top: 60%;
		left: 25%;
		animation: sparkle 1.3s ease-out 0.4s forwards;
	}

	.sparkle:nth-child(8) {
		top: 40%;
		right: 25%;
		animation: sparkle 1.1s ease-out 0.5s forwards;
	}

	/* Animasi dengan peak effect di 50-60% dan auto hide di 100% */
	@keyframes celebrate-1 {
		0% {
			transform: scale(0) rotate(0deg);
			opacity: 0;
		}
		20% {
			transform: scale(2) rotate(90deg);
			opacity: 1;
		}
		50% {
			transform: scale(4) rotate(180deg);
			opacity: 0.9;
		}
		75% {
			transform: scale(2.5) rotate(300deg) translate(30px, -30px);
			opacity: 0.6;
		}
		100% {
			transform: scale(0) rotate(540deg) translate(50px, -50px);
			opacity: 0;
		}
	}

	@keyframes celebrate-2 {
		0% {
			transform: scale(0) rotate(0deg);
			opacity: 0;
		}
		15% {
			transform: scale(1.5) rotate(-60deg);
			opacity: 1;
		}
		55% {
			transform: scale(3.5) rotate(-180deg);
			opacity: 0.95;
		}
		80% {
			transform: scale(1.8) rotate(-320deg) translate(-30px, -40px);
			opacity: 0.4;
		}
		100% {
			transform: scale(0) rotate(-540deg) translate(-60px, -70px);
			opacity: 0;
		}
	}

	@keyframes celebrate-3 {
		0% {
			transform: scale(0) rotate(0deg);
			opacity: 0;
		}
		25% {
			transform: scale(2.5) rotate(120deg);
			opacity: 1;
		}
		60% {
			transform: scale(3.2) rotate(270deg);
			opacity: 0.85;
		}
		85% {
			transform: scale(1.5) rotate(420deg) translate(40px, 20px);
			opacity: 0.3;
		}
		100% {
			transform: scale(0) rotate(540deg) translate(70px, 40px);
			opacity: 0;
		}
	}

	@keyframes celebrate-4 {
		0% {
			transform: scale(0) rotate(0deg);
			opacity: 0;
		}
		18% {
			transform: scale(2) rotate(-45deg);
			opacity: 1;
		}
		58% {
			transform: scale(3.8) rotate(-180deg);
			opacity: 0.9;
		}
		82% {
			transform: scale(1.6) rotate(-300deg) translate(-35px, 25px);
			opacity: 0.35;
		}
		100% {
			transform: scale(0) rotate(-450deg) translate(-65px, 50px);
			opacity: 0;
		}
	}

	@keyframes celebrate-center {
		0% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
		30% {
			transform: translate(-50%, -50%) scale(4);
			opacity: 1;
		}
		65% {
			transform: translate(-50%, -50%) scale(6);
			opacity: 0.8;
		}
		90% {
			transform: translate(-50%, -50%) scale(2);
			opacity: 0.2;
		}
		100% {
			transform: translate(-50%, -50%) scale(0);
			opacity: 0;
		}
	}

	@keyframes sparkle {
		0% {
			transform: scale(0) rotate(0deg);
			opacity: 0;
			box-shadow: 0 0 0px #fff;
		}
		30% {
			transform: scale(1.5) rotate(120deg);
			opacity: 1;
			box-shadow: 0 0 8px #fff;
		}
		70% {
			transform: scale(2.5) rotate(240deg);
			opacity: 0.9;
			box-shadow:
				0 0 15px #fff,
				0 0 25px #60a5fa;
		}
		90% {
			transform: scale(1) rotate(330deg);
			opacity: 0.3;
			box-shadow: 0 0 5px #fff;
		}
		100% {
			transform: scale(0) rotate(360deg);
			opacity: 0;
			box-shadow: 0 0 0px #fff;
		}
	}

	/* Container bounce effect */
	@keyframes celebration-bounce {
		0% {
			transform: scale(1);
		}
		30% {
			transform: scale(1.05);
		}
		60% {
			transform: scale(0.98);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
