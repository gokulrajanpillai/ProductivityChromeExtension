import { StorageService } from '../services/storage';
import { Settings } from '../types';

export class SettingsModal {
    private container: HTMLElement;
    private settings: Settings | null = null;
    private onClose: () => void;

    constructor(onClose: () => void) {
        this.container = document.createElement('div');
        this.container.className = 'settings-modal-overlay';
        this.onClose = onClose;
    }

    async render() {
        this.settings = await StorageService.getSettings();

        this.container.innerHTML = `
      <div class="settings-modal">
        <div class="settings-header">
          <h2>Zen Settings</h2>
          <button class="close-btn">×</button>
        </div>
        <div class="settings-body">
          <div class="setting-group">
            <label>Focus Duration (minutes)</label>
            <input type="number" id="focus-duration" value="${this.settings.focusDuration}" min="1" max="60">
          </div>
          <div class="setting-group">
            <label>Break Duration (minutes)</label>
            <input type="number" id="break-duration" value="${this.settings.breakDuration}" min="1" max="30">
          </div>
          <div class="setting-group">
            <label>Long Break Duration (minutes)</label>
            <input type="number" id="long-break-duration" value="${this.settings.longBreakDuration}" min="5" max="60">
          </div>
          <div class="setting-group checkbox-group">
            <label>
              <input type="checkbox" id="enable-sound" ${this.settings.enableSound ? 'checked' : ''}>
              Enable Sounds
            </label>
          </div>
           <div class="setting-group checkbox-group">
            <label>
              <input type="checkbox" id="enable-break-reminders" ${this.settings.enableBreakReminders ? 'checked' : ''}>
              Break Reminders
            </label>
          </div>
        </div>
        <div class="settings-footer">
          <button class="save-btn">Save Changes</button>
        </div>
      </div>
    `;

        document.body.appendChild(this.container);

        // Event Listeners
        this.container.querySelector('.close-btn')?.addEventListener('click', () => this.close());
        this.container.querySelector('.save-btn')?.addEventListener('click', () => this.save());

        // Close on click outside
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) this.close();
        });
    }

    close() {
        this.container.remove();
        this.onClose();
    }

    async save() {
        if (!this.settings) return;

        const focusInput = this.container.querySelector('#focus-duration') as HTMLInputElement;
        const breakInput = this.container.querySelector('#break-duration') as HTMLInputElement;
        const longBreakInput = this.container.querySelector('#long-break-duration') as HTMLInputElement;
        const soundInput = this.container.querySelector('#enable-sound') as HTMLInputElement;
        const remindersInput = this.container.querySelector('#enable-break-reminders') as HTMLInputElement;

        const newSettings: Settings = {
            ...this.settings,
            focusDuration: parseInt(focusInput.value) || 20,
            breakDuration: parseInt(breakInput.value) || 5,
            longBreakDuration: parseInt(longBreakInput.value) || 15,
            enableSound: soundInput.checked,
            enableBreakReminders: remindersInput.checked
        };

        await StorageService.saveSettings(newSettings);
        // Notify background to update if needed (timer duration changes only take effect on next start usually, but we could force update if idle)
        // For now, simpler is fine.
        this.close();
    }
}
