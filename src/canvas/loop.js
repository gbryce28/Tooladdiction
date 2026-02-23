// loop.js
// Manages the animation loop and coordinates signal → parameter → behavior.
// The draw() function is called every frame and updates the ring based on input.

class SketchLoop {
  constructor(ctx, width, height, inputHandler) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.inputHandler = inputHandler;
    
    // Parameter: ring radius controlled by mouse X position
    this.radius = 50;
    this.pulseSpeed = 0.02;
    this.pulsePhase = 0;
    
    // Bind methods to preserve 'this' context
    this.draw = this.draw.bind(this);
    this.update = this.update.bind(this);
  }
  
  update() {
    // SIGNAL → PARAMETER
    // Read the raw signal (mouse X position, 0 to window.width)
    const normalizedX = this.inputHandler.getMouseX() / this.width;
    
    // Map signal to parameter (radius: 10 to 200 pixels)
    // Smaller radius = slower pulse, larger radius = faster pulse
    this.radius = 10 + (normalizedX * 190);
    
    // Pulse speed tied to radius: bigger ring = faster pulse
    this.pulseSpeed = 0.01 + (normalizedX * 0.04);
    
    // Update pulse phase
    this.pulsePhase += this.pulseSpeed;
  }
  
  draw() {
    // Clear canvas completely (black background)
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw the pulsing ring at center of screen
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // Calculate pulse using sine wave
    const pulseAmount = Math.sin(this.pulsePhase) * 0.3;
    const currentRadius = this.radius * (1 + pulseAmount);
    
    // Draw ring (white stroke, no fill)
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
    this.ctx.stroke();
  }
  
  start() {
    // Request animation frame and loop
    const animate = () => {
      this.update();
      this.draw();
      requestAnimationFrame(animate);
    };
    
    // Start the loop
    requestAnimationFrame(animate);
  }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SketchLoop;
}
