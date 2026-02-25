// src/breathing/guide.js
// Visual breathing guide: 6 breaths × 6 seconds each.
// Inhale (6s), exhale (6s), repeat 6 times.

class BreathingGuide {
  constructor() {
    this.elements = {
      circle: document.getElementById('breathingCircle'),
      label: document.getElementById('breathingLabel'),
      counter: document.getElementById('breathingCounter')
    };

    this.state = {
      isRunning: false,
      currentBreath: 0,
      totalBreaths: 6,
      isInhaling: true,
      breathDuration: 6000, // 6 seconds per phase
      timeoutId: null
    };

    this.onComplete = null;
  }

  start(onCompleteCallback) {
    if (this.state.isRunning) return;

    this.state.isRunning = true;
    this.state.currentBreath = 0;
    this.state.isInhaling = true;
    this.onComplete = onCompleteCallback;

    this.nextPhase();
  }

  nextPhase() {
    if (!this.state.isRunning) return;

    // If we've completed all breaths, we're done
    if (this.state.currentBreath >= this.state.totalBreaths) {
      this.stop();
      if (this.onComplete) {
        this.onComplete();
      }
      return;
    }

    // Update UI based on phase
    const phase = this.state.isInhaling ? 'inhaling' : 'exhaling';
    const label = this.state.isInhaling ? 'Inhale' : 'Exhale';

    // Apply animation
    this.elements.circle.classList.remove('inhaling', 'exhaling');
    this.elements.circle.classList.add(phase);

    // Update label
    this.elements.label.textContent = label;

    // Update counter (only increment after full exhale)
    if (!this.state.isInhaling) {
      this.state.currentBreath += 1;
    }
    this.elements.counter.textContent = `${this.state.currentBreath} / ${this.state.totalBreaths}`;

    // Toggle phase for next cycle
    this.state.isInhaling = !this.state.isInhaling;

    // Schedule next phase
    this.state.timeoutId = setTimeout(() => this.nextPhase(), this.state.breathDuration);
  }

  stop() {
    this.state.isRunning = false;
    this.elements.circle.classList.remove('inhaling', 'exhaling');

    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId);
      this.state.timeoutId = null;
    }
  }

  getState() {
    return {
      isRunning: this.state.isRunning,
      currentBreath: this.state.currentBreath,
      totalBreaths: this.state.totalBreaths
    };
  }
}
