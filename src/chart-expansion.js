// src/chart-expansion.js
// Handles chart expansion modal and detailed visualization

class ChartExpansion {
  constructor() {
    this.modal = document.getElementById('graphModal');
    this.graphContainer = document.getElementById('graphContainer');
    this.closeBtn = document.getElementById('closeGraphModal');
    this.backdrop = document.querySelector('.graph-modal-backdrop');
    this.expandedCanvas = document.getElementById('expandedMoodGraph');
    
    this.data = [];
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Open modal
    this.graphContainer?.addEventListener('click', (e) => {
      // Don't open if clicking on canvas directly for potential future interactions
      if (e.target.id === 'moodGraph') {
        this.openModal();
      } else if (this.graphContainer.contains(e.target)) {
        this.openModal();
      }
    });

    // Close modal
    this.closeBtn?.addEventListener('click', () => this.closeModal());
    this.backdrop?.addEventListener('click', () => this.closeModal());
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display !== 'none') {
        this.closeModal();
      }
    });
  }

  openModal() {
    if (!this.modal) return;
    this.modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Draw expanded chart after modal is visible
    setTimeout(() => {
      this.drawExpandedChart();
      this.updateStats();
    }, 50);
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  setData(entries) {
    this.data = entries || [];
  }

  drawExpandedChart() {
    if (!this.expandedCanvas || this.data.length === 0) return;

    const ctx = this.expandedCanvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = this.expandedCanvas.clientWidth || this.expandedCanvas.offsetWidth;
    let height = this.expandedCanvas.clientHeight || this.expandedCanvas.offsetHeight;

    // Fallback to parent dimensions if canvas has no size yet
    if (!width && this.expandedCanvas.parentElement) {
      width = this.expandedCanvas.parentElement.clientWidth - 30;
    }
    if (!height && this.expandedCanvas.parentElement) {
      height = 400;
    }

    // Default fallback sizes
    if (!width) width = 500;
    if (!height) height = 400;

    this.expandedCanvas.width = Math.round(width * dpr);
    this.expandedCanvas.height = Math.round(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Sort and filter
    const sorted = [...this.data]
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    const valid = sorted.filter(e => Number.isFinite(Number(e.mood)) && Number(e.mood) > 0);
    
    if (valid.length === 0) {
      ctx.fillStyle = '#a8b5c8';
      ctx.font = '14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('No mood data available', width / 2, height / 2);
      return;
    }

    // Layout
    const padding = 50;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    // Draw axes
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1.5;
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Y-axis labels (mood scale 1-5)
    ctx.font = '11px system-ui';
    ctx.fillStyle = '#7a8fa8';
    ctx.textAlign = 'right';
    for (let mood = 5; mood >= 1; mood--) {
      const y = height - padding - ((mood - 1) / 4) * graphHeight;
      ctx.fillText(mood, padding - 12, y + 4);
      
      // Grid lines
      if (mood > 1) {
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
      }
    }

    // X-axis labels (dates with day of week)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7a8fa8';
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const step = Math.max(1, Math.floor(valid.length / 8)); // Show ~8 labels max
    valid.forEach((entry, i) => {
      if (i % step === 0 || i === valid.length - 1) {
        const x = padding + (i / (valid.length - 1 || 1)) * graphWidth;
        const date = new Date(entry.date);
        const dayOfWeek = dayNames[date.getDay()];
        const dateStr = (date.getMonth() + 1) + '/' + date.getDate();
        const label = dayOfWeek + ' ' + dateStr;
        ctx.fillText(label, x, height - padding + 20);
      }
    });

    // Scale for fixed 1-5 range
    const scaleMin = 1;
    const scaleMax = 5;
    const range = scaleMax - scaleMin;
    const xFor = (index) => padding + (index / (valid.length - 1 || 1)) * graphWidth;
    const yForMood = (mood) => height - padding - ((mood - scaleMin) / range) * graphHeight;

    // Calculate and draw mean line
    const moods = valid.map(e => Number(e.mood));
    const mean = moods.reduce((a, b) => a + b, 0) / moods.length;
    const meanY = yForMood(mean);
    
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, meanY);
    ctx.lineTo(width - padding, meanY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Mean label
    ctx.font = '11px system-ui';
    ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.textAlign = 'left';
    ctx.fillText(`Mean: ${mean.toFixed(2)}`, padding + 8, meanY - 8);

    // Draw line with gradient effect
    ctx.strokeStyle = '#4a9eff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    
    valid.forEach((entry, i) => {
      const mood = Number(entry.mood);
      if (!Number.isFinite(mood) || mood <= 0) return;
      
      const x = xFor(i);
      const y = yForMood(Math.max(1, Math.min(5, mood)));
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Find and draw trough distance markers
    const troughIndices = [];
    valid.forEach((entry, i) => {
      const mood = Number(entry.mood);
      if (mood === 1) {
        troughIndices.push(i);
      }
    });

    // Draw connecting lines between troughs with distance labels
    for (let i = 0; i < troughIndices.length - 1; i++) {
      const idx1 = troughIndices[i];
      const idx2 = troughIndices[i + 1];
      
      const x1 = xFor(idx1);
      const x2 = xFor(idx2);
      const troughY = yForMood(1);
      
      // Distance in terms of entries
      const distance = idx2 - idx1;
      
      // Draw connecting line between troughs below the chart
      const connectorY = troughY + 25;
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.4)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x1, connectorY);
      ctx.lineTo(x2, connectorY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw distance label
      const midX = (x1 + x2) / 2;
      ctx.font = 'bold 11px system-ui';
      ctx.fillStyle = '#ff9999';
      ctx.textAlign = 'center';
      ctx.fillText(`${distance}d`, midX, connectorY + 15);
      
      // Draw small vertical indicators at each trough point to the connector
      ctx.strokeStyle = 'rgba(255, 107, 107, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, troughY);
      ctx.lineTo(x1, connectorY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, troughY);
      ctx.lineTo(x2, connectorY);
      ctx.stroke();
    }

    // Draw enhanced points with peak/trough indicators
    valid.forEach((entry, i) => {
      const mood = Number(entry.mood);
      if (!Number.isFinite(mood) || mood <= 0) return;
      
      const x = xFor(i);
      const y = yForMood(Math.max(1, Math.min(5, mood)));
      
      // Outer glow
      ctx.fillStyle = 'rgba(74, 158, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Main point
      ctx.fillStyle = '#4a9eff';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Peak indicator (Great - 5)
      if (mood === 5) {
        ctx.strokeStyle = '#90ee90';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.stroke();
      } 
      // Trough indicator (Terrible - 1)
      else if (mood === 1) {
        ctx.strokeStyle = '#ff6b6b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Title
    ctx.font = 'bold 16px system-ui';
    ctx.fillStyle = '#e8eef5';
    ctx.textAlign = 'left';
    ctx.fillText(`${valid.length} entries`, padding, padding - 15);
  }

  updateStats() {
    if (this.data.length === 0) {
      document.getElementById('modalHighest').textContent = '—';
      document.getElementById('modalLowest').textContent = '—';
      document.getElementById('modalAverage').textContent = '—';
      document.getElementById('modalStreak').textContent = '—';
      document.getElementById('modalBadDay').textContent = '—';
      document.getElementById('modalGoodDay').textContent = '—';
      document.getElementById('modalTroughCount').textContent = '—';
      document.getElementById('modalPeakCount').textContent = '—';
      return;
    }

    const moods = this.data.map(e => Number(e.mood)).filter(m => m > 0);
    
    if (moods.length === 0) {
      document.getElementById('modalHighest').textContent = '—';
      document.getElementById('modalLowest').textContent = '—';
      document.getElementById('modalAverage').textContent = '—';
      document.getElementById('modalStreak').textContent = '—';
      document.getElementById('modalBadDay').textContent = '—';
      document.getElementById('modalGoodDay').textContent = '—';
      document.getElementById('modalTroughCount').textContent = '—';
      document.getElementById('modalPeakCount').textContent = '—';
      return;
    }

    // Find highest mood and its date with day of week
    const highest = Math.max(...moods);
    const highestEntry = this.data.find(e => Number(e.mood) === highest);
    const highestDate = highestEntry ? new Date(highestEntry.date) : null;
    const highestDayOfWeek = highestDate ? this.getDayOfWeek(highestDate) : '';
    const highestLabel = highestEntry ? `${this.getMoodLabel(highest)} (${highestDayOfWeek})` : '—';
    document.getElementById('modalHighest').textContent = highestLabel;

    // Find lowest mood and its date with day of week
    const lowest = Math.min(...moods);
    const lowestEntry = this.data.find(e => Number(e.mood) === lowest);
    const lowestDate = lowestEntry ? new Date(lowestEntry.date) : null;
    const lowestDayOfWeek = lowestDate ? this.getDayOfWeek(lowestDate) : '';
    const lowestLabel = lowestEntry ? `${this.getMoodLabel(lowest)} (${lowestDayOfWeek})` : '—';
    document.getElementById('modalLowest').textContent = lowestLabel;

    // Average
    const avg = moods.reduce((a, b) => a + b, 0) / moods.length;
    document.getElementById('modalAverage').textContent = avg.toFixed(1);

    // Streak (consecutive days with mood >= 3)
    const streak = this.calculatePositiveStreak();
    document.getElementById('modalStreak').textContent = streak + ' days';

    // Find most common day for bad moods (1-2)
    const badMoodDays = this.data
      .filter(e => Number(e.mood) <= 2)
      .map(e => this.getDayOfWeek(new Date(e.date)));
    const badDayCount = {};
    badMoodDays.forEach(day => badDayCount[day] = (badDayCount[day] || 0) + 1);
    const mostCommonBadDay = Object.keys(badDayCount).length > 0
      ? Object.entries(badDayCount).sort((a, b) => b[1] - a[1])[0][0]
      : '—';
    document.getElementById('modalBadDay').textContent = mostCommonBadDay !== '—' ? mostCommonBadDay : '—';

    // Find most common day for good moods (4-5)
    const goodMoodDays = this.data
      .filter(e => Number(e.mood) >= 4)
      .map(e => this.getDayOfWeek(new Date(e.date)));
    const goodDayCount = {};
    goodMoodDays.forEach(day => goodDayCount[day] = (goodDayCount[day] || 0) + 1);
    const mostCommonGoodDay = Object.keys(goodDayCount).length > 0
      ? Object.entries(goodDayCount).sort((a, b) => b[1] - a[1])[0][0]
      : '—';
    document.getElementById('modalGoodDay').textContent = mostCommonGoodDay !== '—' ? mostCommonGoodDay : '—';

    // Count troughs (1) and peaks (5)
    const troughCount = this.data.filter(e => Number(e.mood) === 1).length;
    const peakCount = this.data.filter(e => Number(e.mood) === 5).length;
    document.getElementById('modalTroughCount').textContent = troughCount;
    document.getElementById('modalPeakCount').textContent = peakCount;
  }

  getMoodLabel(mood) {
    const labels = {
      1: 'Terrible',
      2: 'Bad',
      3: 'Okay',
      4: 'Good',
      5: 'Great'
    };
    return labels[mood] || '—';
  }

  getDayOfWeek(date) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  }

  calculatePositiveStreak() {
    const sorted = [...this.data]
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let streak = 0;
    let currentStreak = 0;
    
    for (const entry of sorted) {
      const mood = Number(entry.mood);
      if (mood >= 3) {
        currentStreak++;
        streak = Math.max(streak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return streak;
  }
}

// Initialize chart expansion when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.chartExpansion = new ChartExpansion();
  });
} else {
  window.chartExpansion = new ChartExpansion();
}
