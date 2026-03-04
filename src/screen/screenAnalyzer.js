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

    return patterns;
  }

  getInsights() {
    const insights = [];
    const correlation = this.getCorrelation();
    const ranges = this.getMoodByScreenTimeRange();
    const phoneImpact = this.getPhoneImpact();
    const moodTrend = this.getMoodTrend();
    const dayPatterns = this.getMoodByDayOfWeek();

    // Mood trend insight
    if (moodTrend) {
      if (moodTrend.direction === 'improving') {
        insights.push('Your mood has been improving lately. Keep going.');
      } else if (moodTrend.direction === 'declining') {
        insights.push('Your mood has shifted down recently. This is valid. It will shift again.');
      } else {
        insights.push('Your mood is relatively stable.');
      }
    }

    // Day pattern insights
    if (dayPatterns && dayPatterns.length > 0) {
      const sorted = [...dayPatterns].sort((a, b) => b.average - a.average);
      const best = sorted[0];
      const worst = sorted[sorted.length - 1];
      const difference = best.average - worst.average;

      if (best.average > 3.5) {
        insights.push(`You tend to feel better on ${best.day}s.`);
      } else if (best.average > 3) {
        insights.push(`${best.day}s are relatively good for you.`);
      } else if (difference > 0.5) {
        insights.push(`${best.day}s tend to be your stronger mood days.`);
      }

      if (worst.average < 2.5) {
        insights.push(`${worst.day}s tend to be harder. That's okay. It's temporary.`);
      } else if (worst.average < 3) {
        insights.push(`${worst.day}s are typically more challenging for you.`);
      } else if (difference > 0.5) {
        insights.push(`${worst.day}s tend to be your lower mood days.`);
      }

      if (difference > 0.8) {
        insights.push(`Your mood varies by about ${difference.toFixed(1)} points across different days of the week. Awareness helps.`);
      } else if (difference > 0.3) {
        insights.push(`There's subtle variation in your mood across different days—notice which days support you.`);
      }
    }

    // Correlation insight - always generate based on actual correlation strength
    if (correlation !== null) {
      if (correlation < -0.3) {
        insights.push('Higher screen time correlates with lower mood. When you reduce screen time, your mood tends to improve.');
      } else if (correlation > 0.3) {
        insights.push('Interestingly, higher screen time correlates with better mood in your data. Context matters—check your notes.');
      } else if (correlation < -0.1) {
        insights.push('There\'s a slight negative trend between screen time and mood. Small reductions might help.');
      } else if (correlation > 0.1) {
        insights.push('Your data shows a subtle positive correlation between screen time and mood. Individual factors vary.');
      } else {
        insights.push('Your mood and screen time show weak correlation. Other factors may be more influential.');
      }
    }

    // Screen time range insight - always generate the comparison
    if (ranges) {
      if (ranges.low && ranges.high) {
        const diff = ranges.low.average - ranges.high.average;
        const lowCount = ranges.low.moods.length;
        const highCount = ranges.high.moods.length;
        
        if (diff > 0.5) {
          insights.push(`Days with 0-4 hours of screen time average mood ${ranges.low.average}, while 8+ hours average ${ranges.high.average}.`);
        } else if (diff < -0.5) {
          insights.push(`Days with 8+ hours of screen time average mood ${ranges.high.average}, while 0-4 hours average ${ranges.low.average}. Higher screen time correlates with better mood for you.`);
        } else if (lowCount > 0 && highCount > 0) {
          insights.push(`Days with 0-4 hours of screen time average mood ${ranges.low.average}, while 8+ hours average ${ranges.high.average}. The difference is subtle.`);
        }
      } else if (ranges.low || ranges.medium || ranges.high) {
        const available = [];
        if (ranges.low && ranges.low.moods.length > 0) available.push(`light use: ${ranges.low.average}`);
        if (ranges.medium && ranges.medium.moods.length > 0) available.push(`moderate use: ${ranges.medium.average}`);
        if (ranges.high && ranges.high.moods.length > 0) available.push(`heavy use: ${ranges.high.average}`);
        
        if (available.length > 0) {
          insights.push(`Your mood varies across screen time levels: ${available.join(', ')}.`);
        }
      }
    }

    // Phone impact insight - provide context even with smaller differences
    if (phoneImpact) {
      if (phoneImpact.difference > 0.3) {
        insights.push(`Phone-heavy days average mood ${phoneImpact.phoneHeavy}, while phone-light days average ${phoneImpact.phoneLight}.`);
      } else if (phoneImpact.difference < -0.3) {
        insights.push(`Phone-light days average mood ${phoneImpact.phoneLight}, while phone-heavy days average ${phoneImpact.phoneHeavy}.`);
      } else if (Math.abs(phoneImpact.difference) > 0) {
        insights.push(`Phone usage shows minimal mood difference in your data (${Math.abs(phoneImpact.difference).toFixed(1)} points).`);
      }
    }

    return insights;
  }
}
