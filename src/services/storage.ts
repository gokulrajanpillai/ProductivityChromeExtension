import { Task, TimerState, Settings } from '../types';

const KEYS = {
    TASKS: 'zen_tasks',
    TIMER: 'zen_timer',
    SETTINGS: 'zen_settings',
};

const DEFAULT_SETTINGS: Settings = {
    focusDuration: 20,
    breakDuration: 5,
    longBreakDuration: 15,
    enableSound: false,
    enableBreakReminders: true,
    backgroundIntensity: 50,
};

const DEFAULT_TIMER: TimerState = {
    isRunning: false,
    mode: 'focus',
    remainingSeconds: 20 * 60,
    activeTaskId: null,
    lastTick: Date.now(),
    cyclesCompleted: 0,
};

export const StorageService = {
    async getTasks(): Promise<Task[]> {
        const result = await chrome.storage.sync.get(KEYS.TASKS);
        return (result[KEYS.TASKS] as Task[]) || [];
    },

    async saveTasks(tasks: Task[]): Promise<void> {
        await chrome.storage.sync.set({ [KEYS.TASKS]: tasks });
    },

    async getTimerState(): Promise<TimerState> {
        const result = await chrome.storage.local.get(KEYS.TIMER); // Local is better for frequent updates
        return (result[KEYS.TIMER] as TimerState) || DEFAULT_TIMER;
    },

    async saveTimerState(state: TimerState): Promise<void> {
        await chrome.storage.local.set({ [KEYS.TIMER]: state });
    },

    async getSettings(): Promise<Settings> {
        const result = await chrome.storage.sync.get(KEYS.SETTINGS);
        return { ...DEFAULT_SETTINGS, ...(result[KEYS.SETTINGS] as Partial<Settings> || {}) };
    },

    async saveSettings(settings: Settings): Promise<void> {
        await chrome.storage.sync.set({ [KEYS.SETTINGS]: settings });
    },

    // Helper to observe changes
    onChange(callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void) {
        chrome.storage.onChanged.addListener(callback);
    }
};
