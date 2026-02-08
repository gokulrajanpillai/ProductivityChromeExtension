export class Footer {
    constructor(private container: HTMLElement) { }

    render(isBreak: boolean) {
        if (!isBreak) {
            this.container.innerHTML = '';
            return;
        }

        const reminders = [
            'Stretch your neck and shoulders',
            'Close your eyes for 20 seconds',
            'Drink some water',
            'Take a deep breath'
        ];

        // Simple rotation or random
        const reminder = reminders[Math.floor(Math.random() * reminders.length)];

        this.container.innerHTML = `
      <div class="zen-footer-reminder fade-in">
        <span class="reminder-icon">🍃</span>
        <span class="reminder-text">${reminder}</span>
      </div>
    `;
    }
}
