// src/screen/screenStorage.js
// Storage for mood + screen time entries.
// Simple localStorage wrapper for correlation tracking.

class ScreenStorage {
  constructor() {
    this.storageKey = 'screenMood_entries';
  }

  addEntry(date, mood, screenTime, isPhoneHeavy = false, note = '') {
    const entries = this.getEntries();
    const dateStr = date.toISOString().split('T')[0];

    // Replace if entry for today already exists
    const index = entries.findIndex(e => e.date === dateStr);
    if (index !== -1) {
      entries[index] = { date: dateStr, mood, screenTime, isPhoneHeavy, note, timestamp: Date.now() };
    } else {
      entries.push({ date: dateStr, mood, screenTime, isPhoneHeavy, note, timestamp: Date.now() });
    }

    this.saveEntries(entries);
  }

  getEntries() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveEntries(entries) {
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
