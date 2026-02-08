import '../styles/main.css';
import { Header } from '../components/Header';
import { TimerDisplay } from '../components/TimerDisplay';
import { TaskList } from '../components/TaskList';
import { Footer } from '../components/Footer';
import { StorageService } from '../services/storage';
import { TimerState, Task } from '../types';

const app = document.getElementById('app');

if (app) {
    app.innerHTML = `
      <div class="zen-layout">
        <header id="header-zone"></header>
        <main id="main-zone"></main>
        <footer id="footer-zone"></footer>
      </div>
    `;

    const header = new Header(document.getElementById('header-zone')!);
    // Actually, Main zone should contain both TaskList and Timer.
    // Let's adjust layout
    document.getElementById('main-zone')!.innerHTML = `
        <div id="timer-section"></div>
        <div id="tasks-section"></div>
    `;
    const timerComponent = new TimerDisplay(document.getElementById('timer-section')!);
    const taskListComponent = new TaskList(document.getElementById('tasks-section')!);
    const footer = new Footer(document.getElementById('footer-zone')!);

    // State
    let timerState: TimerState | null = null;
    let tasks: Task[] = [];

    // Actions
    const refresh = async () => {
        timerState = await chrome.runtime.sendMessage({ type: 'GET_STATE' });
        tasks = await StorageService.getTasks();
        render();
    };

    const render = () => {
        if (!timerState) return;

        // Header
        const statusText = timerState.isRunning
            ? `Focusing on: ${getTaskTitle(timerState.activeTaskId)}`
            : (timerState.mode === 'focus' ? 'Ready when you are' : 'Break time');

        header.render(statusText, toggleSound, openSettings);

        // Timer
        timerComponent.render(
            timerState,
            () => chrome.runtime.sendMessage({ type: 'START_TIMER', payload: { taskId: getActiveTaskId() } }).then(refresh),
            () => chrome.runtime.sendMessage({ type: 'PAUSE_TIMER' }).then(refresh),
            () => chrome.runtime.sendMessage({ type: 'SKIP_TIMER' }).then(refresh)
        );

        // Tasks
        taskListComponent.render(
            tasks,
            timerState.activeTaskId,
            (title) => addTask(title),
            (id) => toggleTask(id),
            (id) => startTask(id),
            (id) => deleteTask(id)
        );

        // Footer
        footer.render(timerState.mode !== 'focus');
    };

    // Helpers
    const getTaskTitle = (id: string | null) => {
        if (!id) return '...';
        return tasks.find(t => t.id === id)?.title || 'Task';
    };

    const getActiveTaskId = () => {
        // If one is already active in UI but not in timer...
        // For now, if starting from timer button, maybe pick the first task?
        // Or we require starting from the task list. 
        // User requirements: "Let me start one active task at a time"
        // "When I press Start on a task: It becomes active"
        // "Buttons: Start focus" -> checks if there is an active task?
        return timerState?.activeTaskId;
    };

    const addTask = async (title: string) => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            isCompleted: false,
            estimatedMinutes: 25,
            createdAt: Date.now(),
            order: tasks.length
        };
        tasks.push(newTask);
        await StorageService.saveTasks(tasks);
        refresh();
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.isCompleted = !task.isCompleted;
            await StorageService.saveTasks(tasks);
            refresh();
        }
    };

    const startTask = async (id: string) => {
        await chrome.runtime.sendMessage({ type: 'START_TIMER', payload: { taskId: id } });
        refresh();
    };

    const deleteTask = async (id: string) => {
        tasks = tasks.filter(t => t.id !== id);
        await StorageService.saveTasks(tasks);
        refresh();
    }

    const toggleSound = async () => {
        const settings = await StorageService.getSettings();
        await StorageService.saveSettings({ ...settings, enableSound: !settings.enableSound });
        // Optional: show toast or visual indicator
    };

    const openSettings = () => {
        import('../components/SettingsModal').then(({ SettingsModal }) => {
            new SettingsModal(() => {
                // On close, refresh to apply settings (like timer duration)
                refresh();
            }).render();
        });
    };

    // Initial Load
    refresh();

    // Listen for updates
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === 'TIMER_UPDATE') {
            timerState = message.payload;
            render();
        }
    });

    // Polling for smoothness (optional, since background sends updates usually on seconds)
    // But background only updates on alarm tick.
}
