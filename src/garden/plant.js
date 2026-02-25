// src/garden/plant.js
// Plant object: represents a single practice instance.
// Plants have position, growth state, and visual properties.

class Plant {
  constructor(x, y, type = 'leaf') {
    this.x = x;
    this.y = y;
    this.type = type; // 'leaf', 'flower', 'grass'
    this.age = 0;
    this.maxAge = 100;
    this.isGrowing = true;

    // Visual properties
    this.baseSize = Math.random() * 8 + 4;
    this.currentSize = this.baseSize;
    this.rotation = Math.random() * Math.PI * 2;
    this.color = this.getColor();
  }

  getColor() {
    const colors = {
      leaf: ['#6b9e7f', '#7daa8f', '#5a8a6f', '#8db99f'],
      flower: ['#d4a5a5', '#e8b4b8', '#d9a8b8', '#e0b8c8'],
      grass: ['#a8b896', '#9eb890', '#b8c8a0', '#a0b088']
    };
    return colors[this.type][Math.floor(Math.random() * colors[this.type].length)];
  }

  update() {
    if (this.isGrowing && this.age < this.maxAge) {
      this.age += 1;
      // Ease-out growth curve
      this.currentSize = this.baseSize * Math.pow(this.age / this.maxAge, 0.5);
    } else if (this.age >= this.maxAge) {
      this.isGrowing = false;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.85;

    if (this.type === 'leaf') {
      this.drawLeaf(ctx);
    } else if (this.type === 'flower') {
      this.drawFlower(ctx);
    } else if (this.type === 'grass') {
      this.drawGrass(ctx);
    }

    ctx.restore();
  }

  drawLeaf(ctx) {
    // Organic leaf shape
    ctx.beginPath();
    ctx.ellipse(0, 0, this.currentSize * 1.2, this.currentSize * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawFlower(ctx) {
    // Simple petal arrangement
    const petalSize = this.currentSize * 0.6;
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 / 5) * i;
      const px = Math.cos(angle) * this.currentSize;
      const py = Math.sin(angle) * this.currentSize;
      ctx.beginPath();
      ctx.arc(px, py, petalSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawGrass(ctx) {
    // Blade of grass
    ctx.beginPath();
    ctx.moveTo(0, -this.currentSize);
    ctx.lineTo(-this.currentSize * 0.3, 0);
    ctx.lineTo(0, this.currentSize);
    ctx.lineTo(this.currentSize * 0.3, 0);
    ctx.closePath();
    ctx.fill();
  }
}
