import { Task } from '../types';

export class TaskList {
    constructor(private container: HTMLElement) { }

    render(tasks: Task[], activeTaskId: string | null, onAddTask: (title: string) => void, onToggleTask: (id: string) => void, onStartTask: (id: string) => void, onDeleteTask: (id: string) => void) {
        this.container.innerHTML = `
      <div class="task-list-panel">
        <h2 class="task-title">Today's Path</h2>
        
        <div class="add-task-row">
            <input type="text" id="new-task-input" placeholder="Add a calm next step..." />
            <button id="add-task-btn">+</button>
        </div>

        <div class="tasks-container">
          ${tasks.length === 0 ? '<div class="empty-state">Breathe. The path is clear.</div>' : ''}
          ${tasks.map(task => this.renderTaskRow(task, activeTaskId)).join('')}
        </div>
      </div>
    `;

        // Event Listeners
        const input = this.container.querySelector('#new-task-input') as HTMLInputElement;
        const addBtn = this.container.querySelector('#add-task-btn');

        const handleAdd = () => {
            if (input.value.trim()) {
                onAddTask(input.value.trim());
                input.value = '';
            }
        };

        addBtn?.addEventListener('click', handleAdd);
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAdd();
        });

        // Delegation for list items
        this.container.querySelectorAll('.task-checkbox').forEach(el => {
            el.addEventListener('click', (e) => onToggleTask((e.target as HTMLElement).dataset.id!));
        });

        this.container.querySelectorAll('.start-task-btn').forEach(el => {
            el.addEventListener('click', (e) => onStartTask((e.target as HTMLElement).dataset.id!));
        });

        this.container.querySelectorAll('.delete-task-btn').forEach(el => {
            el.addEventListener('click', (e) => onDeleteTask((e.target as HTMLElement).dataset.id!));
        });
    }

    private renderTaskRow(task: Task, activeTaskId: string | null): string {
        const isActive = task.id === activeTaskId;
        const isDone = task.isCompleted;

        return `
        <div class="task-row ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}" data-id="${task.id}">
            <div class="task-checkbox ${isDone ? 'checked' : ''}" data-id="${task.id}"></div>
            <div class="task-content">
                <span class="task-name">${task.title}</span>
                <span class="task-estimate">${task.estimatedMinutes}m</span>
            </div>
            ${!isDone && !isActive ? `<button class="start-task-btn" data-id="${task.id}">Focus</button>` : ''}
            ${isActive ? `<span class="active-indicator">Running</span>` : ''}
            <button class="delete-task-btn" data-id="${task.id}">×</button>
        </div>
      `;
    }
}
