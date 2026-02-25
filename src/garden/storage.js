// src/garden/storage.js
// Simple localStorage wrapper for habit garden state.
// No tracking of behavior. Just saving the current state.

class GardenStorage {
  constructor() {
    this.storageKey = 'habitGarden_state';
  }

  saveState(state) {
    const data = {
      habitName: state.habitName,
      practiceCount: state.practiceCount,
      practiceHistory: state.practiceHistory
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  loadState() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : null;
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
