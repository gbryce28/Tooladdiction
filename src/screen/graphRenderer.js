// src/screen/graphRenderer.js
// Renders graphs using Canvas 2D API.
// Mood, Screen Time, and Deviation from averages.

class GraphRenderer {
  drawCorrelationGraph(canvas, entries) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (entries.length === 0) return;

    const padding = 30;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14);
    if (sorted.length === 0) return;

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    sorted.forEach((entry, i) => {
      const x = padding + (i / (sorted.length - 1 || 1)) * graphWidth;
      const moodY = height - padding - (entry.mood / 5) * graphHeight;
      const screenY = height - padding - (entry.screenTime / 24) * graphHeight;

      ctx.fillStyle = '#aaa';
      ctx.beginPath();
      ctx.arc(x, moodY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(x, screenY, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = '11px system-ui';
    ctx.fillStyle = '#aaa';
    ctx.fillText('● Mood (1-5)', padding, padding - 8);
    ctx.fillStyle = '#666';
    ctx.fillText('● Screen Time (hours)', padding + 140, padding - 8);
  }

  drawMoodGraph(canvas, entries) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.clientWidth || canvas.offsetWidth;
    let height = canvas.clientHeight || canvas.offsetHeight;

    // Fallback to parent dimensions if canvas has no size yet
    if (!width && canvas.parentElement) {
      width = canvas.parentElement.clientWidth;
    }
    if (!height && canvas.parentElement) {
      height = canvas.parentElement.clientHeight - 10; // Account for padding/border
    }

    // Default fallback sizes
    if (!width) width = 400;
    if (!height) height = 200;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (!entries || entries.length === 0) return;

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const valid = sorted.filter(e => Number.isFinite(Number(e.mood)) && Number(e.mood) > 0);
    if (valid.length === 0) return;

    const padding = 28;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Keep scale fixed to mood scale (1..5) so behavior stays stable as data grows.
    const scaleMin = 1;
    const scaleMax = 5;
    const range = scaleMax - scaleMin;
    const xFor = (index) => padding + (index / (sorted.length - 1 || 1)) * graphWidth;
    const yForMood = (mood) => height - padding - ((mood - scaleMin) / range) * graphHeight;

    // Draw segmented line so missing days do not connect across gaps.
    ctx.strokeStyle = '#cfcfcf';
    ctx.lineWidth = 2;
    let drawing = false;
    ctx.beginPath();
    sorted.forEach((entry, i) => {
      const mood = Number(entry.mood);
      if (!Number.isFinite(mood) || mood <= 0) {
        drawing = false;
        return;
      }
      const x = xFor(i);
      const y = yForMood(Math.max(1, Math.min(5, mood)));
      if (!drawing) {
        ctx.moveTo(x, y);
        drawing = true;
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Points
    ctx.fillStyle = '#e8eef5';
    sorted.forEach((entry, i) => {
      const mood = Number(entry.mood);
      if (!Number.isFinite(mood) || mood <= 0) return;
      const x = xFor(i);
      const y = yForMood(Math.max(1, Math.min(5, mood)));
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = '12px system-ui';
    ctx.fillStyle = '#a8b5c8';
    ctx.textAlign = 'center';
    ctx.fillText('Last 30 days', width / 2, height - 8);
  }

  drawScreenTimeGraph(canvas, entries) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (entries.length === 0) return;

    const padding = 30;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted.length === 0) return;

    // Draw axes
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    sorted.forEach((entry, i) => {
      const x = padding + (i / (sorted.length - 1 || 1)) * graphWidth;
      const y = height - padding - (entry.screenTime / 24) * graphHeight;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    sorted.forEach((entry, i) => {
      const x = padding + (i / (sorted.length - 1 || 1)) * graphWidth;
      const y = height - padding - (entry.screenTime / 24) * graphHeight;
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels
    ctx.font = '11px system-ui';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('Days', width / 2, height - 8);
  }

  drawDeviationGraph(canvas, entries) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    if (entries.length < 2) return;

    const padding = 30;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate averages
    const avgMood = sorted.reduce((sum, e) => sum + e.mood, 0) / sorted.length;
    const avgScreen = sorted.reduce((sum, e) => sum + e.screenTime, 0) / sorted.length;

    // Calculate deviations
    const deviations = sorted.map(e => ({
      moodDev: e.mood - avgMood,
      screenDev: e.screenTime - avgScreen
    }));

    // Find max deviation for scaling
    const maxMoodDev = Math.max(...deviations.map(d => Math.abs(d.moodDev)));
    const maxScreenDev = Math.max(...deviations.map(d => Math.abs(d.screenDev)));

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

    // Zero line
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, height - padding - (graphHeight / 2));
    ctx.lineTo(width - padding, height - padding - (graphHeight / 2));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw mood deviation line
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    deviations.forEach((dev, i) => {
      const x = padding + (i / (deviations.length - 1 || 1)) * graphWidth;
      const y = height - padding - (dev.moodDev / (maxMoodDev || 1)) * (graphHeight / 2);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw screen time deviation line
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    deviations.forEach((dev, i) => {
      const x = padding + (i / (deviations.length - 1 || 1)) * graphWidth;
      const y = height - padding - (dev.screenDev / (maxScreenDev || 1)) * (graphHeight / 2);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw points
    deviations.forEach((dev, i) => {
      const x = padding + (i / (deviations.length - 1 || 1)) * graphWidth;
      
      const moodY = height - padding - (dev.moodDev / (maxMoodDev || 1)) * (graphHeight / 2);
      ctx.fillStyle = '#aaa';
      ctx.beginPath();
      ctx.arc(x, moodY, 2, 0, Math.PI * 2);
      ctx.fill();

      const screenY = height - padding - (dev.screenDev / (maxScreenDev || 1)) * (graphHeight / 2);
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(x, screenY, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels
    ctx.font = '11px system-ui';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'center';
    ctx.fillText('Days', width / 2, height - 8);

    // Legend
    ctx.font = 'bold 10px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#aaa';
    ctx.fillText('● Mood Deviation', padding, padding - 8);
    ctx.fillStyle = '#666';
    ctx.fillText('● Screen Time Deviation', padding + 160, padding - 8);
  }
}
