import { TimerService } from '../services/timer';
import { StorageService } from '../services/storage';

console.log('Zen Task: Background Service Worker Started');

const timerService = new TimerService();

// Initialize
timerService.init();

// Alarms
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'zen-timer-tick') {
        timerService.tick();
    }
});

// Messages
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    (async () => {
        if (message.type === 'START_TIMER') {
            await timerService.start(message.payload?.taskId);
            sendResponse({ success: true });
        } else if (message.type === 'PAUSE_TIMER') {
            await timerService.pause();
            sendResponse({ success: true });
        } else if (message.type === 'RESET_TIMER') {
            await timerService.reset();
            sendResponse({ success: true });
        } else if (message.type === 'SKIP_TIMER') {
            await timerService.skip();
            sendResponse({ success: true });
        } else if (message.type === 'GET_STATE') {
            const state = await StorageService.getTimerState();
            sendResponse(state);
        }
    })();
    return true; // Keep channel open for async response
});
