// main.js
// Screen & Mood: Orchestrator for three-step daily reflection.
// Step 1: Mood rating → Step 2: Screen time → Step 3: Graph view

const app = {
  state: {
    step: 1,
    selectedMood: null,
    screenTime: 0,
    isPhoneHeavy: false,
    screenNote: '',
    allEntries: []
  },

  elements: {
    // Steps
    step1: document.getElementById('step1'),
    step2: document.getElementById('step2'),
    step3: document.getElementById('step3'),
    viewMode: document.getElementById('viewMode'),

    // Step 1
    moodOptions: document.querySelectorAll('.mood-option'),
    moodNextBtn: document.getElementById('moodNextBtn'),

    // Step 2
    screenHours: document.getElementById('screenHours'),
    phoneCheckbox: document.getElementById('phoneCheckbox'),
    screenNote: document.getElementById('screenNote'),
    screenBackBtn: document.getElementById('screenBackBtn'),
    screenNextBtn: document.getElementById('screenNextBtn'),

    // Step 3
    summaryMood: document.getElementById('summaryMood'),
    summaryScreen: document.getElementById('summaryScreen'),
    patternText: document.getElementById('patternText'),
    graphBackBtn: document.getElementById('graphBackBtn'),
    saveBtn: document.getElementById('saveBtn'),

    // View mode
    editBtn: document.getElementById('editBtn'),
    exampleDataBtn: document.getElementById('exampleDataBtn'),
    correlationGraph: document.getElementById('correlationGraph'),
    moodGraph: document.getElementById('moodGraph'),
    screenTimeGraph: document.getElementById('screenTimeGraph'),
    deviationGraph: document.getElementById('deviationGraph'),
    daysTracked: document.getElementById('daysTracked'),
    avgMoodStat: document.getElementById('avgMoodStat'),
    avgScreenStat: document.getElementById('avgScreenStat'),
    correlationStat: document.getElementById('correlationStat'),
    insightsContainer: document.getElementById('insightsContainer'),
    patternText: document.getElementById('patternText')
  },

  // Instances
  storage: null,
  analyzer: null,
  graphRenderer: null,

  init() {
    this.storage = new ScreenStorage();
    
    // Generate test data if empty (for development/testing)
    let entries = this.storage.getEntries();
    if (entries.length === 0) {
      this.generateTestData();
      entries = this.storage.getEntries();
    }
    
    this.state.allEntries = entries;
    this.analyzer = new ScreenAnalyzer(this.state.allEntries);
    this.graphRenderer = new GraphRenderer();

    // If we have data, go to view mode; otherwise start at step 1
    if (entries.length > 0) {
      this.state.step = null;
    }

    this.setupEventListeners();
    this.render();
  },

  generateTestData() {
    // Generate 30 days of randomized data for testing
    const today = new Date();
    const moods = [1, 2, 3, 4, 5];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Create slight correlation: higher screen time tends to lower mood
      const screenTime = Math.random() * 12 + 2; // 2-14 hours
      const moodVariation = Math.max(1, Math.min(5, 5.5 - (screenTime * 0.2) + (Math.random() * 1.5 - 0.75)));
      const mood = Math.round(moodVariation);
      const isPhoneHeavy = Math.random() > 0.5;
      
      this.storage.addEntry(date, mood, parseFloat(screenTime.toFixed(1)), isPhoneHeavy);
    }
  },

  setupEventListeners() {
    // Step 1
    this.elements.moodOptions.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.selectedMood = parseInt(e.currentTarget.dataset.mood);
        this.updateMoodButtons();
        this.elements.moodNextBtn.disabled = false;
      });
    });
    this.elements.moodNextBtn.addEventListener('click', () => this.goToStep(2));

    // Step 2
    this.elements.screenHours.addEventListener('input', () => {
      this.state.screenTime = parseFloat(this.elements.screenHours.value) || 0;
      this.elements.screenNextBtn.disabled = this.state.screenTime === 0;
    });
    this.elements.phoneCheckbox.addEventListener('change', () => {
      this.state.isPhoneHeavy = this.elements.phoneCheckbox.checked;
    });
    this.elements.screenNote.addEventListener('input', () => {
      this.state.screenNote = this.elements.screenNote.value;
    });
    this.elements.screenBackBtn.addEventListener('click', () => this.goToStep(1));
    this.elements.screenNextBtn.addEventListener('click', () => this.goToStep(3));

    // Step 3
    this.elements.graphBackBtn.addEventListener('click', () => this.goToStep(2));
    this.elements.saveBtn.addEventListener('click', () => this.saveEntry());

    // View mode
    this.elements.editBtn.addEventListener('click', () => this.startNewEntry());
    this.elements.exampleDataBtn.addEventListener('click', () => this.loadExampleData());

    window.addEventListener('resize', () => this.renderGraphs());
  },

  updateMoodButtons() {
    this.elements.moodOptions.forEach(btn => {
      const mood = parseInt(btn.dataset.mood);
      if (mood === this.state.selectedMood) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  },

  goToStep(step) {
    this.state.step = step;
    this.render();
  },

  saveEntry() {
    const today = new Date();
    this.storage.addEntry(today, this.state.selectedMood, this.state.screenTime, this.state.isPhoneHeavy, this.state.screenNote);
    this.state.allEntries = this.storage.getEntries();
    this.analyzer.updateEntries(this.state.allEntries);

    this.resetForm();
    this.showViewMode();
  },

  resetForm() {
    this.state.selectedMood = null;
    this.state.screenTime = 0;
    this.state.isPhoneHeavy = false;
    this.state.screenNote = '';
    this.elements.screenHours.value = '';
    this.elements.phoneCheckbox.checked = false;
    this.elements.screenNote.value = '';
  },

  startNewEntry() {
    this.resetForm();
    this.state.step = 1;
    this.render();
  },

  render() {
    // Hide all sections
    this.elements.step1.style.display = 'none';
    this.elements.step2.style.display = 'none';
    this.elements.step3.style.display = 'none';
    this.elements.viewMode.style.display = 'none';

    // Show current step or view mode
    if (this.state.allEntries.length === 0 || this.state.step) {
      if (this.state.step === 1) {
        this.elements.step1.style.display = 'flex';
      } else if (this.state.step === 2) {
        this.elements.step2.style.display = 'flex';
      } else if (this.state.step === 3) {
        this.elements.step3.style.display = 'flex';
        setTimeout(() => this.renderGraphs(), 100);
      }
    } else {
      this.showViewMode();
    }
  },

  renderGraphs() {
    // Step 3 graph (small)
    if (this.elements.correlationGraph.offsetParent !== null) {
      this.graphRenderer.drawCorrelationGraph(
        this.elements.correlationGraph,
        this.state.allEntries
      );
    }

    // View mode graphs
    if (this.elements.moodGraph && this.elements.moodGraph.offsetParent !== null) {
      this.graphRenderer.drawMoodGraph(
        this.elements.moodGraph,
        this.state.allEntries
      );
    }

    if (this.elements.screenTimeGraph && this.elements.screenTimeGraph.offsetParent !== null) {
      this.graphRenderer.drawScreenTimeGraph(
        this.elements.screenTimeGraph,
        this.state.allEntries
      );
    }

    if (this.elements.deviationGraph && this.elements.deviationGraph.offsetParent !== null) {
      this.graphRenderer.drawDeviationGraph(
        this.elements.deviationGraph,
        this.state.allEntries
      );
    }

    this.updateStats();
  },

  updateStats() {
    const avgMood = this.analyzer.getAverageMood();
    const avgScreen = this.analyzer.getAverageScreenTime();
    const correlation = this.analyzer.getCorrelation();
    const insights = this.analyzer.getInsights();

    // Step 3 summary
    const moodLabels = { 1: 'Terrible', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Great' };
    this.elements.summaryMood.textContent = this.state.selectedMood ? moodLabels[this.state.selectedMood] : '—';
    this.elements.summaryScreen.textContent = this.state.screenTime + 'h';
    this.elements.patternText.textContent = insights.length > 0 ? insights[0] : 'Keep logging to see patterns.';

    // View mode stats
    this.elements.daysTracked.textContent = this.state.allEntries.length;
    this.elements.avgMoodStat.textContent = avgMood ? avgMood.toFixed(1) : '—';
    this.elements.avgScreenStat.textContent = avgScreen ? avgScreen.toFixed(1) : '—';
    this.elements.correlationStat.textContent = correlation !== null ? (correlation > 0 ? '+' : '') + correlation.toFixed(2) : '—';

    // Insights
    if (insights.length > 0) {
      this.elements.insightsContainer.innerHTML = insights.map(insight => 
        `<div class="insight-item">${insight}</div>`
      ).join('');
    } else {
      this.elements.insightsContainer.innerHTML = '<p class="empty-state">Log at least 5 days to see patterns.</p>';
    }
  },

  showViewMode() {
    this.state.step = null;
    this.elements.step1.style.display = 'none';
    this.elements.step2.style.display = 'none';
    this.elements.step3.style.display = 'none';
    this.elements.viewMode.style.display = 'block';
    this.renderGraphs();
  },

  loadExampleData() {
    this.storage.clear();
    this.generateTestData();
    this.state.allEntries = this.storage.getEntries();
    this.analyzer = new ScreenAnalyzer(this.state.allEntries);
    this.state.step = null;
    this.render();
  }
};

// Initialize when DOM is ready
app.init();
// Debug functions (for development)
window.debugMode = {
  regenerateTestData() {
    app.storage.clear();
    app.generateTestData();
    app.state.allEntries = app.storage.getEntries();
    app.analyzer = new ScreenAnalyzer(app.state.allEntries);
    app.render();
    app.renderGraphs();
    console.log('✓ Test data regenerated. Total entries:', app.state.allEntries.length);
  },
  
  clearData() {
    app.storage.clear();
    app.state.allEntries = [];
    app.analyzer = new ScreenAnalyzer([]);
    app.render();
    console.log('✓ All data cleared');
  },
  
  showEntries() {
    console.table(app.state.allEntries);
  },
  
  help() {
    console.log(`
    Debug Mode Commands:
    - debugMode.regenerateTestData()  : Clear and regenerate 30 days of test data
    - debugMode.clearData()           : Clear all data
    - debugMode.showEntries()         : Show all entries in table format
    - debugMode.help()                : Show this help menu
    `);
  }
};

console.log('Debug mode available. Type debugMode.help() for commands.');