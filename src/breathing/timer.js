// src/breathing/timer.js
// Simple countdown timer for 10-minute intervals.
// No data tracking. Just time management.

class Timer {
  constructor(totalSeconds) {
    this.totalSeconds = totalSeconds;
    this.timeRemaining = totalSeconds;
    this.isRunning = false;
    this.intervalId = null;
    this.onTick = null;
    this.onComplete = null;
  }

  start(onTickCallback, onCompleteCallback) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.onTick = onTickCallback;
    this.onComplete = onCompleteCallback;

    this.intervalId = setInterval(() => {
      this.timeRemaining -= 1;

      if (this.onTick) {
        this.onTick();
      }

      if (this.timeRemaining <= 0) {
        this.stop();
        if (this.onComplete) {
          this.onComplete();
        }
      }
    }, 1000);
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.pause();
    this.timeRemaining = this.totalSeconds;
  }

  stop() {
    this.pause();
  }

  getTimeRemaining() {
    return Math.max(0, this.timeRemaining);
  }

  getTotalTime() {
    return this.totalSeconds;
  }
}
