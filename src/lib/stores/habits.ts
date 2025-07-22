import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

// Tipe untuk struktur habit
export interface Habit {
	id: string;
	name: string;
	category: string;
	createdAt: string;
	completions: Record<string, boolean>; // format: { 'YYYY-MM-DD': true }
}

// Tipe untuk notifikasi
export interface Notification {
	id: number;
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	timestamp: number;
}

// Fungsi untuk mendapatkan hari ini dalam format YYYY-MM-DD
function getTodayString(): string {
	return new Date().toISOString().split('T')[0];
}

// Fungsi untuk mendapatkan data dari localStorage
function getStoredHabits(): Habit[] {
	if (!browser) return [];
	const stored = localStorage.getItem('habits');
	return stored ? (JSON.parse(stored) as Habit[]) : [];
}

// Fungsi untuk menyimpan ke localStorage
function saveHabits(habits: Habit[]) {
	if (browser) {
		localStorage.setItem('habits', JSON.stringify(habits));
	}
}

// Store utama untuk habits
function createHabitsStore() {
	const { subscribe, set, update } = writable<Habit[]>([]);

	return {
		subscribe,

		// Inisialisasi dari localStorage
		init: () => {
			const stored = getStoredHabits();
			set(stored);
		},

		// Tambah habit baru
		addHabit: (name: string, category: string = 'general', createdAt?: string) => {
			const newHabit: Habit = {
				id: Date.now().toString(),
				name: name.trim(),
				category,
				createdAt: createdAt ?? new Date().toISOString(),
				completions: {}
			};

			update((habits) => {
				const updated = [...habits, newHabit];
				saveHabits(updated);
				return updated;
			});
		},

		// Hapus habit
		removeHabit: (id: string) => {
			update((habits) => {
				const updated = habits.filter((h) => h.id !== id);
				saveHabits(updated);
				return updated;
			});
		},

		// Toggle completion untuk hari tertentu
		toggleCompletion: (id: string, date: string = getTodayString()) => {
			update((habits) => {
				const updated = habits.map((habit) => {
					if (habit.id === id) {
						const completions = { ...habit.completions };
						if (completions[date]) {
							delete completions[date];
						} else {
							completions[date] = true;
						}
						return { ...habit, completions };
					}
					return habit;
				});
				saveHabits(updated);
				return updated;
			});
		},

		// Reset semua data (untuk testing)
		reset: () => {
			if (browser) {
				localStorage.removeItem('habits');
			}
			set([]);
		}
	};
}

export const habits = createHabitsStore();

// Store untuk notifikasi
export const notifications: Writable<Notification[]> = writable([]);

// Fungsi helper untuk menambah notifikasi
export function addNotification(
	message: string,
	type: 'success' | 'error' | 'info' | 'warning' = 'success'
) {
	notifications.update((n) => [
		...n,
		{
			id: Date.now(),
			message,
			type,
			timestamp: Date.now()
		}
	]);
}
