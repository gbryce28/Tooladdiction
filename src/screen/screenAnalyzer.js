// src/screen/screenAnalyzer.js
// Analyzes correlation between screen time and mood.
// Calculates statistics and generates insights.

class ScreenAnalyzer {
  constructor(entries = []) {
    this.entries = entries;
  }

  updateEntries(entries) {
    this.entries = entries;
  }

  getAverageMood() {
    if (this.entries.length === 0) return null;
    const sum = this.entries.reduce((total, e) => total + e.mood, 0);
    return sum / this.entries.length;
  }

  getAverageScreenTime() {
    if (this.entries.length === 0) return null;
    const sum = this.entries.reduce((total, e) => total + e.screenTime, 0);
    return sum / this.entries.length;
  }

  getCorrelation() {
    if (this.entries.length < 3) return null;

    const n = this.entries.length;
    let sumXY = 0, sumX = 0, sumY = 0, sumX2 = 0, sumY2 = 0;

    this.entries.forEach(e => {
      const x = e.screenTime;
      const y = e.mood;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
      sumY2 += y * y;
    });

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    if (denominator === 0) return 0;
    return numerator / denominator;
  }

  getMoodByScreenTimeRange() {
    if (this.entries.length < 3) return null;

    const ranges = {
      low: { min: 0, max: 4, moods: [] },
      medium: { min: 4, max: 8, moods: [] },
      high: { min: 8, max: 24, moods: [] }
    };

    this.entries.forEach(e => {
      if (e.screenTime <= 4) {
        ranges.low.moods.push(e.mood);
      } else if (e.screenTime <= 8) {
        ranges.medium.moods.push(e.mood);
      } else {
        ranges.high.moods.push(e.mood);
      }
    });

    const results = {};
    Object.entries(ranges).forEach(([key, range]) => {
      if (range.moods.length > 0) {
        const avg = range.moods.reduce((sum, m) => sum + m, 0) / range.moods.length;
        results[key] = { average: Math.round(avg * 10) / 10, count: range.moods.length };
      }
    });

    return Object.keys(results).length > 0 ? results : null;
  }

  getPhoneImpact() {
    const phoneHeavy = this.entries.filter(e => e.isPhoneHeavy);
    const phoneLight = this.entries.filter(e => !e.isPhoneHeavy);

    if (phoneHeavy.length === 0 || phoneLight.length === 0) return null;

    const phoneHeavyMood = phoneHeavy.reduce((sum, e) => sum + e.mood, 0) / phoneHeavy.length;
    const phoneLightMood = phoneLight.reduce((sum, e) => sum + e.mood, 0) / phoneLight.length;

    return {
      phoneHeavy: Math.round(phoneHeavyMood * 10) / 10,
      phoneLight: Math.round(phoneLightMood * 10) / 10,
      difference: Math.round((phoneLightMood - phoneHeavyMood) * 10) / 10
    };
  }

  getInsights() {
    const insights = [];
    const correlation = this.getCorrelation();
    const ranges = this.getMoodByScreenTimeRange();
    const phoneImpact = this.getPhoneImpact();

    if (correlation !== null) {
      if (correlation < -0.3) {
        insights.push('Higher screen time correlates with lower mood. When you reduce screen time, your mood tends to improve.');
      } else if (correlation > 0.3) {
        insights.push('Interestingly, higher screen time correlates with better mood in your data. Context matters—check your notes.');
      } else {
        insights.push('Your mood and screen time show weak correlation. Other factors may be more influential.');
      }
    }

    if (ranges) {
      if (ranges.low && ranges.high) {
        const diff = ranges.low.average - ranges.high.average;
        if (diff > 0.5) {
          insights.push(`Days with 0-4 hours of screen time average mood ${ranges.low.average}, while 8+ hours average ${ranges.high.average}.`);
        }
      }
    }

    if (phoneImpact && phoneImpact.difference > 0.3) {
      insights.push(`Phone-heavy days average mood ${phoneImpact.phoneHeavy}, while phone-light days average ${phoneImpact.phoneLight}.`);
    }

    return insights;
  }
}
