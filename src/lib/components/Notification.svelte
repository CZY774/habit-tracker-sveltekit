<!-- src/lib/components/Notification.svelte -->
<script lang="ts">
    import { notifications } from '../stores/habits';
    import { onMount } from 'svelte';
    import { CheckCircle, Info, AlertTriangle, X, CircleAlert } from 'lucide-svelte';
    import type { Notification } from '../stores/habits';

    let visibleNotifications: Notification[] = [];

    // Sync visibleNotifications with store
    $: {
        visibleNotifications = $notifications;

        $notifications.forEach((notification: Notification) => {
            if (!notification.timeoutId) {
                notification.timeoutId = setTimeout(() => {
                    removeNotification(notification.id);
                }, 4000);
            }
        });
    }

    function removeNotification(id: number): void {
        notifications.update((n: Notification[]) => n.filter(notif => notif.id !== id));
    }

    function getIcon(type: string) {
        switch (type) {
            case 'success': return CheckCircle;
            case 'error': return CircleAlert;
            case 'warning': return AlertTriangle;
            case 'info': return Info;
            default: return CheckCircle;
        }
    }

    function getColors(type: string): string {
        switch (type) {
            case 'success': return 'from-green-400 to-green-600 text-white dark:from-green-500 dark:to-green-700';
            case 'error': return 'from-red-400 to-red-600 text-white dark:from-red-500 dark:to-red-700';
            case 'warning': return 'from-yellow-400 to-orange-500 text-white dark:from-yellow-500 dark:to-orange-600';
            case 'info': return 'from-blue-400 to-blue-600 text-white dark:from-blue-500 dark:to-blue-700';
            default: return 'from-green-400 to-green-600 text-white dark:from-green-500 dark:to-green-700';
        }
    }

    onMount(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    });
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
    {#each visibleNotifications as notification (notification.id)}
        <div 
            class="notification-item max-w-sm bg-gradient-to-r {getColors(notification.type)} rounded-lg shadow-lg transform transition-all duration-300"
            style="animation: slideIn 0.3s ease-out;"
        >
            <div class="flex items-center p-4">
                <!-- Icon -->
                <div class="flex-shrink-0 mr-3">
                    <svelte:component this={getIcon(notification.type)} size={20} />
                </div>
                
                <!-- Message -->
                <div class="flex-1 text-sm font-medium">
                    {notification.message}
                </div>
                
                <!-- Close Button -->
                <button
                    on:click={() => removeNotification(notification.id)}
                    class="flex-shrink-0 ml-2 p-1 hover:bg-white/20 rounded-full transition-colors duration-200 dark:hover:bg-gray-700/20"
                >
                    <X size={16} />
                </button>
            </div>
            
            <!-- Progress Bar -->
            <div class="h-1 bg-white/20 overflow-hidden dark:bg-gray-700/20">
                <div 
                    class="h-full bg-white/40 notification-progress dark:bg-gray-600/40"
                    style="animation: progress 4s linear;"
                ></div>
            </div>
        </div>
    {/each}
</div>

<style>
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes progress {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
    }

    .notification-item {
        backdrop-filter: blur(10px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
</style>