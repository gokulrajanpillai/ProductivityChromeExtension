import { TimerState } from '../types';

export class TimerDisplay {
    constructor(private container: HTMLElement) { }

    render(state: TimerState, onStart: () => void, onPause: () => void, onSkip: () => void) {
        const minutes = Math.floor(state.remainingSeconds / 60).toString().padStart(2, '0');
        const seconds = (state.remainingSeconds % 60).toString().padStart(2, '0');

        this.container.innerHTML = `
      <div class="timer-container mode-${state.mode}">
        <div class="timer-ring">
           <!-- SVG Ring would go here -->
           <div class="timer-time">${minutes}:${seconds}</div>
        </div>
        <div class="timer-controls">
          ${!state.isRunning ?
                `<button id="start-btn" class="primary-btn">Start Focus</button>` :
                `<button id="pause-btn" class="secondary-btn">Pause</button>`
            }
          <button id="skip-btn" class="text-btn">Skip</button>
        </div>
        <div class="timer-cycle">
           ${state.mode === 'focus' ? 'Focus Cycle' : 'Rest & Restore'}
        </div>
      </div>
    `;

        this.container.querySelector('#start-btn')?.addEventListener('click', onStart);
        this.container.querySelector('#pause-btn')?.addEventListener('click', onPause);
        this.container.querySelector('#skip-btn')?.addEventListener('click', onSkip);
    }
}
