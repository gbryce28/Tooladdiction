// src/screen/graphRenderer.js
// Renders graphs using Canvas 2D API.
// Mood, Screen Time, and Deviation from averages.

class GraphRenderer {
  drawCorrelationGraph(canvas, entries) {
    if (entries.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-14);
    if (sorted.length === 0) return;

    ctx.strokeStyle = '#3a4f6f';
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

      ctx.fillStyle = '#777';
      ctx.beginPath();
      ctx.arc(x, screenY, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.font = '12px system-ui';
    ctx.fillStyle = '#bbb';
    ctx.fillText('● Mood (1-5)', padding, padding - 10);
    ctx.fillStyle = '#888';
    ctx.fillText('● Screen Time (hours)', padding + 140, padding - 10);
  }

  drawMoodGraph(canvas, entries) {
    if (entries.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted.length === 0) return;

    // Draw axes
    ctx.strokeStyle = '#3a4f6f';
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
    ctx.strokeStyle = '#aaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    sorted.forEach((entry, i) => {
      const x = padding + (i / (sorted.length - 1 || 1)) * graphWidth;
      const y = height - padding - (entry.mood / 5) * graphHeight;
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
      const y = height - padding - (entry.mood / 5) * graphHeight;
      ctx.fillStyle = '#aaa';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels
    ctx.font = '11px system-ui';
    ctx.fillStyle = '#bbb';
    ctx.textAlign = 'center';
    ctx.fillText('Days', width / 2, height - 8);
  }

  drawScreenTimeGraph(canvas, entries) {
    if (entries.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const padding = 40;
    const graphWidth = width - padding * 2;
    const graphHeight = height - padding * 2;

    const sorted = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted.length === 0) return;

    // Draw axes
    ctx.strokeStyle = '#3a4f6f';
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
    ctx.strokeStyle = '#777';
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
      ctx.fillStyle = '#777';
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels
    ctx.font = '11px system-ui';
    ctx.fillStyle = '#bbb';
    ctx.textAlign = 'center';
    ctx.fillText('Days', width / 2, height - 8);
  }

  drawDeviationGraph(canvas, entries) {
    if (entries.length < 2) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const padding = 50;
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
    ctx.strokeStyle = '#3a4f6f';
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
    ctx.strokeStyle = '#3a4f6f';
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
    ctx.strokeStyle = '#777';
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
      ctx.fillStyle = '#777';
      ctx.beginPath();
      ctx.arc(x, screenY, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Labels
    ctx.font = '12px system-ui';
    ctx.fillStyle = '#bbb';
    ctx.textAlign = 'center';
    ctx.fillText('Days', width / 2, height - 8);

    // Legend
    ctx.font = 'bold 11px system-ui';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#aaa';
    ctx.fillText('● Mood Deviation', padding, padding - 10);
    ctx.fillStyle = '#777';
    ctx.fillText('● Screen Time Deviation', padding + 160, padding - 10);
  }
}
