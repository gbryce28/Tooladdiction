// src/garden/canvas.js
// Garden canvas: renders plants and manages animation loop.

class GardenCanvas {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.plants = [];
    this.animationId = null;
    this.width = this.canvas.offsetWidth;
    this.height = this.canvas.offsetHeight;

    this.setupCanvas();
    this.startAnimation();
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.setupCanvas();
  }

  addPlant(animate = true) {
    // Random position in lower half of canvas (garden)
    const x = Math.random() * this.width;
    const y = this.height * 0.5 + Math.random() * (this.height * 0.4);

    // Vary plant types
    const types = ['leaf', 'flower', 'grass'];
    const type = types[Math.floor(Math.random() * types.length)];

    const plant = new Plant(x, y, type);
    this.plants.push(plant);
  }

  update() {
    for (const plant of this.plants) {
      plant.update();
    }
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#f0ede8';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw sky gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height * 0.5);
    gradient.addColorStop(0, '#e8f4f1');
    gradient.addColorStop(1, '#f0ede8');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height * 0.5);

    // Draw plants
    for (const plant of this.plants) {
      plant.draw(this.ctx);
    }
  }

  animate() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  startAnimation() {
    if (!this.animationId) {
      this.animate();
    }
  }

  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  clear() {
    this.plants = [];
    this.draw();
  }
}
