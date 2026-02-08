export interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    estimatedMinutes: number; // Default 25
    createdAt: number;
    order: number;
}

export type TimerMode = 'focus' | 'break' | 'longBreak';

export interface TimerState {
    isRunning: boolean;
    mode: TimerMode;
    remainingSeconds: number;
    activeTaskId: string | null;
    lastTick: number; // Timestamp for sync correction
    cyclesCompleted: number; // To track 4 cycles -> long break
}

export interface Settings {
    focusDuration: number; // default 20 (user requested 20, though typical pomodoro is 25)
    breakDuration: number; // default 5
    longBreakDuration: number; // default 15
    enableSound: boolean;
    enableBreakReminders: boolean;
    backgroundIntensity: number;
}
