import { TimerState, TimerMode, Settings } from '../types';
import { StorageService } from './storage';

const ALARM_NAME = 'zen-timer-tick';

export class TimerService {
    private state: TimerState;
    private settings: Settings | null = null;

    constructor() {
        this.state = {
            isRunning: false,
            mode: 'focus',
            remainingSeconds: 20 * 60,
            activeTaskId: null,
            lastTick: Date.now(),
            cyclesCompleted: 0
        };
    }

    async init() {
        this.settings = await StorageService.getSettings();
        const savedState = await StorageService.getTimerState();

        // Resume state if valid
        if (savedState) {
            this.state = savedState;
            // If it was running, we need to calculate elapsed time since lastTick
            if (this.state.isRunning) {
                const now = Date.now();
                const elapsed = Math.floor((now - this.state.lastTick) / 1000);
                if (elapsed > 0) {
                    this.tick(elapsed);
                }
            }
        }
    }

    async start(taskId?: string) {
        if (!this.settings) await this.init();

        if (taskId) {
            this.state.activeTaskId = taskId;
        }

        this.state.isRunning = true;
        this.state.lastTick = Date.now();
        await this.saveState();
        await this.createAlarm();
        this.broadcastState();
    }

    async pause() {
        this.state.isRunning = false;
        await this.saveState();
        await this.clearAlarm();
        this.broadcastState();
    }

    async reset() {
        if (!this.settings) await this.init();
        this.state.isRunning = false;
        this.state.remainingSeconds = this.getDurationForMode(this.state.mode);
        await this.saveState();
        await this.clearAlarm();
        this.broadcastState();
    }

    async skip() {
        // Skip current mode to next
        this.switchMode();
    }

    private getDurationForMode(mode: TimerMode): number {
        switch (mode) {
            case 'focus': return (this.settings?.focusDuration || 20) * 60;
            case 'break': return (this.settings?.breakDuration || 5) * 60;
            case 'longBreak': return (this.settings?.longBreakDuration || 15) * 60;
        }
    }

    async tick(_seconds: number = 1) {
        if (!this.state.isRunning) return;

        const now = Date.now();
        const elapsed = Math.floor((now - this.state.lastTick) / 1000);

        if (elapsed > 0) {
            this.state.remainingSeconds -= elapsed;
            this.state.lastTick = now;

            if (this.state.remainingSeconds <= 0) {
                this.state.remainingSeconds = 0;
                await this.handleTimerComplete();
            } else {
                await this.saveState();
                this.broadcastState();
                this.updateBadge(); // Update badge on tick
            }
        }
    }

    private async handleTimerComplete() {
        this.state.isRunning = false;
        await this.clearAlarm();

        // Notify
        this.sendNotification();

        // Switch mode
        this.switchMode();
    }

    private async switchMode() {
        if (this.state.mode === 'focus') {
            this.state.cyclesCompleted++;
            const shouldLongBreak = this.settings?.longBreakDuration && this.state.cyclesCompleted % 4 === 0;
            this.state.mode = shouldLongBreak ? 'longBreak' : 'break';
        } else {
            this.state.mode = 'focus';
        }

        this.state.remainingSeconds = this.getDurationForMode(this.state.mode);
        await this.saveState();
        this.broadcastState();
    }

    private async createAlarm() {
        await chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 / 60 }); // 1 second
    }

    private async clearAlarm() {
        await chrome.alarms.clear(ALARM_NAME);
    }

    private async saveState() {
        await StorageService.saveTimerState(this.state);
    }

    private broadcastState() {
        chrome.runtime.sendMessage({ type: 'TIMER_UPDATE', payload: this.state });
    }

    private updateBadge() {
        const minutes = Math.ceil(this.state.remainingSeconds / 60);
        chrome.action.setBadgeText({ text: minutes.toString() });
        chrome.action.setBadgeBackgroundColor({ color: this.state.mode === 'focus' ? '#d4a373' : '#8da399' });
    }

    private sendNotification() {
        const title = this.state.mode === 'focus' ? 'Focus Complete' : 'Break Over';
        const message = this.state.mode === 'focus' ? 'Time to restore.' : 'Return softly.';

        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'assets/icon128.png',
            title,
            message,
            priority: 1
        });
    }
}
