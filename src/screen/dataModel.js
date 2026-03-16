// src/screen/dataModel.js
// Data model for mood entries with normalization + graph-friendly series output.

class DataModel {
  constructor(storageKey = 'screenMood_entries') {
    this.storageKey = storageKey;
    this.entries = [];
    this.load();
  }

  normalizeDate(value) {
    if (!value) return null;

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, '0');
      const d = String(value.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    const str = String(value).trim();
    const dateOnlyMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) return str;

    const parsed = new Date(str);
    if (Number.isNaN(parsed.getTime())) return null;
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  normalizeMood(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return null;
    return Math.max(1, Math.min(5, Math.round(n)));
  }

  load() {
    let parsed = [];
    try {
      const raw = localStorage.getItem(this.storageKey);
      parsed = raw ? JSON.parse(raw) : [];
    } catch (e) {
      parsed = [];
    }

    if (!Array.isArray(parsed)) parsed = [];

    const byDate = new Map();
    for (const item of parsed) {
      const date = this.normalizeDate(item && item.date);
      const mood = this.normalizeMood(item && item.mood);
      if (!date || mood === null) continue;

      const entry = {
        date,
        mood,
        screenTime: Number(item && item.screenTime) || 0,
        timestamp: Number(item && item.timestamp) || Date.now()
      };

      const existing = byDate.get(date);
      if (!existing || entry.timestamp >= existing.timestamp) {
        byDate.set(date, entry);
      }
    }

    this.entries = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
    this.save();
  }

  save() {
    this.entries.sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(this.storageKey, JSON.stringify(this.entries));
  }

  getEntries() {
    return this.entries.slice();
  }

  getEntriesLast(n = 30) {
    return this.getEntries().slice(-n);
  }

  getMoodSeries(days = 30) {
    const all = this.getEntries();
    if (all.length === 0 || days <= 0) return [];

    const latest = new Date(all[all.length - 1].date + 'T00:00:00');
    if (Number.isNaN(latest.getTime())) return all.map(e => ({ date: e.date, mood: e.mood }));

    const byDate = new Map(all.map(e => [e.date, e]));
    const out = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(latest);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      const found = byDate.get(key);
      out.push({ date: key, mood: found ? found.mood : null });
    }

    return out;
  }

  addEntry(dateLike, mood) {
    const date = this.normalizeDate(dateLike);
    const normalizedMood = this.normalizeMood(mood);
    if (!date || normalizedMood === null) return;

    this.entries = this.entries.filter(e => e.date !== date);
    this.entries.push({
      date,
      mood: normalizedMood,
      screenTime: 0,
      timestamp: Date.now()
    });
    this.save();
  }

  clear() {
    this.entries = [];
    localStorage.removeItem(this.storageKey);
  }

  removeLast() {
    if (this.entries.length === 0) return null;
    this.entries.sort((a, b) => a.date.localeCompare(b.date));
    const removed = this.entries.pop();
    this.save();
    return removed;
  }

  getLastDate() {
    if (this.entries.length === 0) return null;
    this.entries.sort((a, b) => a.date.localeCompare(b.date));
    return this.entries[this.entries.length - 1].date;
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = DataModel;
