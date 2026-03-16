// main.js -- simplified mobile mood log

const app = {
  state: {
    selectedMood: null,
    allEntries: []
  },

  elements: {
    moodOptions: document.querySelectorAll('.mood-option'),
    saveBtn: document.getElementById('saveBtn'),
    exampleDataBtn: document.getElementById('exampleDataBtn'),
    nextDayBtn: document.getElementById('nextDayBtn'),
    undoBtn: document.getElementById('undoBtn'),
    moodGraph: document.getElementById('moodGraph'),
    daysTracked: document.getElementById('daysTracked'),
    avgMoodStat: document.getElementById('avgMoodStat')
  },

  model: null,
  graphRenderer: null,

  init() {
    // Use DataModel for persistent entries
    this.model = new DataModel();
    this.graphRenderer = new GraphRenderer();
    this.state.allEntries = this.model.getEntries();

    this.setupEventListeners();
    this.render();
  },

  generateTestData() {
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${mm}-${dd}`;
      const mood = Math.ceil(1 + Math.random() * 4);
      this.model.addEntry(dateStr, mood);
    }
  },

  setupEventListeners() {
    this.elements.moodOptions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mood = parseInt(e.currentTarget.dataset.mood);
        this.state.selectedMood = mood;
        this.updateMoodButtons();
        this.elements.saveBtn.disabled = false;
      });
    });

    this.elements.saveBtn.addEventListener('click', () => this.saveEntry());
    this.elements.exampleDataBtn.addEventListener('click', () => this.loadExampleData());
    if (this.elements.nextDayBtn) {
      this.elements.nextDayBtn.addEventListener('click', () => this.advanceDay());
    }
    if (this.elements.undoBtn) {
      this.elements.undoBtn.addEventListener('click', () => this.undoLast());
    }

    window.addEventListener('resize', () => this.renderGraph());
  },

  updateMoodButtons() {
    this.elements.moodOptions.forEach(btn => {
      const mood = parseInt(btn.dataset.mood);
      if (mood === this.state.selectedMood) btn.classList.add('selected'); else btn.classList.remove('selected');
    });
  },

  saveEntry() {
    if (!this.state.selectedMood) return;
    const today = new Date();
    // Save today's mood and then show entries
    const y = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${y}-${mm}-${dd}`;
    this.model.addEntry(dateStr, this.state.selectedMood);
    this.state.allEntries = this.model.getEntries();
    // Clear any advance-day marker because user made a manual entry
    try { localStorage.removeItem('screenMood_lastAdvanced'); } catch (e) {}
    this.state.selectedMood = null;
    this.updateMoodButtons();
    this.elements.saveBtn.disabled = true;
    this.render();
  },

  advanceDay() {
    const entries = this.model.getEntries();
    const markerKey = 'screenMood_lastAdvanced';

    // Prefer marker during beta advance session; fallback to last stored date.
    const lastStored = this.model.getLastDate();
    const markerDate = localStorage.getItem(markerKey);
    const baseDateStr = markerDate || lastStored || null;

    let baseDate = null;
    if (baseDateStr) {
      const parts = String(baseDateStr).split('-').map(p => parseInt(p, 10));
      if (parts.length === 3 && parts.every(Number.isFinite)) {
        baseDate = new Date(parts[0], parts[1] - 1, parts[2]);
      }
    }

    if (!baseDate) {
      // First beta press with no data creates today.
      baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 1);
    }

    const existingDates = new Set(entries.map(e => e.date));
    const dt = new Date(baseDate);
    dt.setDate(dt.getDate() + 1);

    let y = dt.getFullYear();
    let mm = String(dt.getMonth() + 1).padStart(2, '0');
    let dd = String(dt.getDate()).padStart(2, '0');
    let nextDate = `${y}-${mm}-${dd}`;

    // Safety: if date already exists, keep moving forward until we find an unused day.
    while (existingDates.has(nextDate)) {
      dt.setDate(dt.getDate() + 1);
      y = dt.getFullYear();
      mm = String(dt.getMonth() + 1).padStart(2, '0');
      dd = String(dt.getDate()).padStart(2, '0');
      nextDate = `${y}-${mm}-${dd}`;
    }

    // Mood priority: selected mood > last entry mood > neutral 3
    let mood = 3;
    if (this.state.selectedMood) {
      mood = this.state.selectedMood;
    } else if (entries.length > 0) {
      mood = Number(entries[entries.length - 1].mood) || 3;
    }

    localStorage.setItem(markerKey, nextDate);
    this.model.addEntry(nextDate, mood);
    this.state.allEntries = this.model.getEntries();
    this.render();
  },

  undoLast() {
    const removed = this.model.removeLast();
    if (!removed) return;
    // Update view entries
    this.state.allEntries = this.model.getEntries();
    try { localStorage.removeItem('screenMood_lastAdvanced'); } catch (e) {}
    this.render();
  },

  loadExampleData() {
    this.model.clear();
    this.generateTestData();
    this.state.allEntries = this.model.getEntries();
    try { localStorage.removeItem('screenMood_lastAdvanced'); } catch (e) {}
    this.render();
  },

  render() {
    this.renderGraph();
    this.updateStats();
    this.updateChartExpansion();
  },

  renderGraph() {
    if (!this.elements.moodGraph) return;
    
    // Use actual recorded points (up to 30) so each new day appends visibly.
    const series = this.model.getEntriesLast(30);
    this.graphRenderer.drawMoodGraph(this.elements.moodGraph, series);
  },

  updateChartExpansion() {
    // Update the chart expansion modal with all data when rendering
    if (window.chartExpansion) {
      window.chartExpansion.setData(this.state.allEntries);
    }
  },

  updateStats() {
    const entries = this.state.allEntries;
    const days = entries.length;
    const avg = days === 0 ? null : entries.reduce((s, e) => s + (e.mood || 0), 0) / days;
    this.elements.daysTracked.textContent = days;
    this.elements.avgMoodStat.textContent = avg ? avg.toFixed(1) : '—';
  }
};

window.addEventListener('DOMContentLoaded', () => app.init());