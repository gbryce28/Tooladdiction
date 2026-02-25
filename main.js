// main.js
// Habit Garden: Orchestrator for the habit cultivation tool.
// Wires together storage, canvas, and UI controls.

const app = {
  state: {
    habitName: null,
    practiceCount: 0,
    practiceHistory: [],
    isInitialized: false
  },

  // DOM Elements
  elements: {
    habitSetup: document.getElementById('habitSetup'),
    habitLog: document.getElementById('habitLog'),
    habitInput: document.getElementById('habitInput'),
    habitTitle: document.getElementById('habitTitle'),
    startBtn: document.getElementById('startBtn'),
    logBtn: document.getElementById('logBtn'),
    changeBtn: document.getElementById('changeBtn'),
    practiceCount: document.getElementById('practiceCount'),
    gardenCanvas: document.getElementById('garden')
  },

  // Instances
  storage: null,
  garden: null,

  init() {
    this.storage = new GardenStorage();
    this.loadState();

    if (this.state.habitName) {
      this.showLogState();
    } else {
      this.showSetupState();
    }

    this.setupEventListeners();
  },

  setupEventListeners() {
    this.elements.startBtn.addEventListener('click', () => this.startHabit());
    this.elements.logBtn.addEventListener('click', () => this.logPractice());
    this.elements.changeBtn.addEventListener('click', () => this.changeHabit());
    this.elements.habitInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.startHabit();
    });

    window.addEventListener('resize', () => this.resizeCanvas());
  },

  startHabit() {
    const habitName = this.elements.habitInput.value.trim();
    if (!habitName) return;

    this.state.habitName = habitName;
    this.state.practiceCount = 0;
    this.state.practiceHistory = [];

    this.storage.saveState(this.state);
    this.initializeGarden();
    this.showLogState();
  },

  changeHabit() {
    this.state.habitName = null;
    this.state.practiceCount = 0;
    this.state.practiceHistory = [];
    this.elements.habitInput.value = '';

    this.storage.saveState(this.state);
    if (this.garden) {
      this.garden.clear();
    }

    this.showSetupState();
  },

  logPractice() {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if already logged today
    if (this.state.practiceHistory.includes(today)) {
      return;
    }

    this.state.practiceCount += 1;
    this.state.practiceHistory.push(today);

    this.storage.saveState(this.state);
    this.updateUI();
    this.garden.addPlant();
  },

  initializeGarden() {
    if (!this.garden) {
      this.garden = new GardenCanvas(this.elements.gardenCanvas);
    }

    this.resizeCanvas();

    // Recreate existing plants from practice count
    for (let i = 0; i < this.state.practiceCount; i++) {
      this.garden.addPlant(false); // false = don't animate
    }
  },

  resizeCanvas() {
    if (this.garden) {
      const rect = this.elements.gardenCanvas.getBoundingClientRect();
      this.garden.resize(rect.width, rect.height);
    }
  },

  showSetupState() {
    this.elements.habitSetup.style.display = 'flex';
    this.elements.habitLog.style.display = 'none';
    this.elements.habitInput.focus();
  },

  showLogState() {
    this.elements.habitSetup.style.display = 'none';
    this.elements.habitLog.style.display = 'flex';
    this.elements.habitTitle.textContent = this.state.habitName;
    this.updateUI();
  },

  updateUI() {
    this.elements.practiceCount.textContent = this.state.practiceCount;
  },

  loadState() {
    const saved = this.storage.loadState();
    if (saved) {
      this.state = saved;
    }
  }
};

// Initialize when DOM is ready
app.init();
