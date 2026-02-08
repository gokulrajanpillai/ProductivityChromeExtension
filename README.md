# Zen Task New Tab

A calm, productivity-focused New Tab page for Chrome.

## Installation

1. **Build the extension**:
   If you haven't already, run:
   ```bash
   npm install
   npm run build
   ```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable **Developer mode** in the top right corner.
   - Click **Load unpacked**.
   - Select the `dist` folder in this project directory.

3. **Enjoy**:
   - Open a new tab to see your Zen Dashboard.
   - Click the extension icon in the toolbar to access the quick popup.

## Features

- **Zen Dashboard**: A distraction-free new tab with a focus timer and task list.
- **Focus Timer**: 20-minute focus cycles with 5-minute breaks.
- **Task Management**: Simple task list with drag-and-drop (coming soon) and estimation.
- **Calm Notifications**: Gentle reminders to stretch and breathe.

## Development

- `npm run dev`: Start Vite dev server (mostly for UI components, not full extension context).
- `npm run build`: Build the extension for production.
