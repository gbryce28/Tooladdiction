// src/mood/streakCounter.js
// Streak tracking: counts consecutive days with mood entries.
// Broken streaks can restart—no shame, just reset and continue.

class StreakCounter {
  constructor(entries = []) {
    this.entries = entries;
  }

  updateEntries(entries) {
    this.entries = entries;
  }

  getCurrentStreak() {
    if (this.entries.length === 0) return 0;

    // Sort entries by date (newest first)
    const sorted = [...this.entries].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const entry of sorted) {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));

      // If this entry is today or yesterday, it counts
      if (daysDiff === streak) {
        streak += 1;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // Streak is broken
        break;
      }
    }

    return streak;
  }

  getLongestStreak() {
    if (this.entries.length === 0) return 0;

    const sorted = [...this.entries].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sorted.length; i++) {
      const currentDate = new Date(sorted[i].date);
      const prevDate = new Date(sorted[i - 1].date);
      
      const daysDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        currentStreak += 1;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }
}
