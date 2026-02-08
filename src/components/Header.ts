export class Header {
    constructor(private container: HTMLElement) { }

    render(statusText: string, onToggleSound: () => void, onOpenSettings: () => void) {
        this.container.innerHTML = `
      <div class="zen-header">
        <div class="left">
          <div class="zen-logo"></div>
        </div>
        <div class="center">
          <span class="status-text">${statusText}</span>
        </div>
        <div class="right">
          <button id="sound-toggle" class="icon-btn">Sound</button>
          <button id="settings-btn" class="icon-btn">Settings</button>
        </div>
      </div>
    `;

        this.container.querySelector('#sound-toggle')?.addEventListener('click', onToggleSound);
        this.container.querySelector('#settings-btn')?.addEventListener('click', onOpenSettings);
    }
}
