// src/mood/moodStorage.js
// Storage for mood entries with localStorage.
// No tracking beyond what user enters. Just preservation of their journal.

class MoodStorage {
  constructor() {
    this.storageKey = 'moodCompass_entries';
  }

  addEntry(date, mood, note = '') {
    const entries = this.getEntries();
    const dateStr = date.toISOString().split('T')[0];
    
    // Replace if entry for today already exists
    const index = entries.findIndex(e => e.date === dateStr);
    if (index !== -1) {
      entries[index] = { date: dateStr, mood, note, timestamp: Date.now() };
    } else {
      entries.push({ date: dateStr, mood, note, timestamp: Date.now() });
    }
    
    this.saveEntries(entries);
  }

  getEntries() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  getEntriesFromDays(days) {
    const entries = this.getEntries();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return entries.filter(e => new Date(e.date) >= cutoffDate);
  }

  getTodayEntry() {
    const entries = this.getEntries();
    const today = new Date().toISOString().split('T')[0];
    return entries.find(e => e.date === today);
  }

  saveEntries(entries) {
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
  }

  clear() {
    localStorage.removeItem(this.storageKey);
  }
}
