// src/mood/moodAnalyzer.js
// Analyzes mood patterns from entry history.
// Observational, non-judgmental insights about mood trends.

class MoodAnalyzer {
  constructor(entries = []) {
    this.entries = entries;
    this.moodLabels = {
      1: 'Very Down',
      2: 'Down',
      3: 'Neutral',
      4: 'Good',
      5: 'Great'
    };
    this.moodEmojis = {
      1: '😔',
      2: '😕',
      3: '😐',
      4: '🙂',
      5: '😊'
    };
  }

  updateEntries(entries) {
    this.entries = entries;
  }

  getAverageMood() {
    if (this.entries.length === 0) return null;

    const sum = this.entries.reduce((total, entry) => total + entry.mood, 0);
    const avg = sum / this.entries.length;
    return Math.round(avg * 10) / 10;
  }

  getMoodTrend() {
    if (this.entries.length < 3) return null;

    const sorted = [...this.entries].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    const recent = sorted.slice(-7);
    const earlier = sorted.slice(Math.max(0, sorted.length - 14), sorted.length - 7);

    if (earlier.length === 0) return null;

    const recentAvg = recent.reduce((sum, e) => sum + e.mood, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, e) => sum + e.mood, 0) / earlier.length;

    const change = recentAvg - earlierAvg;
    return {
      direction: change > 0.1 ? 'improving' : change < -0.1 ? 'declining' : 'stable',
      change: Math.round(change * 10) / 10
    };
  }

  getMoodByDayOfWeek() {
    if (this.entries.length < 7) return null;

    const byDay = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };

    this.entries.forEach(entry => {
      const day = new Date(entry.date).getDay();
      byDay[day].push(entry.mood);
    });

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const patterns = [];

    Object.entries(byDay).forEach(([day, moods]) => {
      if (moods.length > 0) {
        const avg = moods.reduce((sum, m) => sum + m, 0) / moods.length;
        patterns.push({
          day: dayNames[day],
          average: Math.round(avg * 10) / 10,
          count: moods.length
        });
      }
    });

    return patterns.length > 0 ? patterns : null;
  }

  getPatternInsights() {
    const insights = [];
    const trend = this.getMoodTrend();
    const dayPatterns = this.getMoodByDayOfWeek();

    // Trend insight - always generate based on actual trend direction
    if (trend) {
      if (trend.direction === 'improving') {
        insights.push('Your mood has been improving lately. Keep going.');
      } else if (trend.direction === 'declining') {
        insights.push('Your mood has shifted down recently. This is valid. It will shift again.');
      } else {
        insights.push('Your mood is relatively stable.');
      }
    }

    // Day pattern insights - always provide comparison even if subtle
    if (dayPatterns && dayPatterns.length > 0) {
      const sorted = [...dayPatterns].sort((a, b) => b.average - a.average);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      const difference = best.average - worst.average;

      // Generate insight about best day - with lower threshold
      if (best.average > 3.5) {
        insights.push(`You tend to feel better on ${best.day}s.`);
      } else if (best.average > 3) {
        insights.push(`${best.day}s are relatively good for you.`);
      } else if (difference > 0.5) {
        insights.push(`${best.day}s tend to be your stronger mood days.`);
      }

      // Generate insight about worst day - with lower threshold
      if (worst.average < 2.5) {
        insights.push(`${worst.day}s tend to be harder. That's okay. It's temporary.`);
      } else if (worst.average < 3) {
        insights.push(`${worst.day}s are typically more challenging for you.`);
      } else if (difference > 0.5) {
        insights.push(`${worst.day}s tend to be your lower mood days.`);
      }

      // Generate overall day pattern insight if there's variation
      if (difference > 0.8) {
        insights.push(`Your mood varies by about ${difference.toFixed(1)} points across different days of the week. Awareness helps.`);
      } else if (difference > 0.3) {
        insights.push(`There's subtle variation in your mood across different days—notice which days support you.`);
      }
    }

    return insights;
  }

  getEncouragementForMood(mood) {
    const messages = {
      1: [
        'This moment is temporary. You showed up to notice—that matters.',
        'It\'s okay to feel this way. Feelings change.',
        'You\'ve been through difficult moments before. You\'ll get through this one too.'
      ],
      2: [
        'Some days are harder. That\'s normal.',
        'This is temporary. You\'ve felt better before and you will again.',
        'Your mood is valid. No need to fix it right now. Just be with it.'
      ],
      3: [
        'Neutral is honest. Not every day needs to be great.',
        'You\'re steady today. That\'s enough.'
      ],
      4: [
        'You\'re in a good place today. Notice it.',
        'This is nice. Let yourself feel it.'
      ],
      5: [
        'You\'re feeling great. Enjoy this.',
        'This is what you\'re capable of. Remember this feeling.'
      ]
    };

    const options = messages[mood] || messages[3];
    return options[Math.floor(Math.random() * options.length)];
  }
}
