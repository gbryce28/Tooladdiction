// main.js
// Wires together all components: canvas setup, input handler, and animation loop.
// This is the orchestrator. It runs immediately when index.html loads.

// Initialize canvas with HiDPI support
const canvasData = setupCanvas();

// Initialize input handler to capture mouse signals
const inputHandler = new InputHandler();

// Initialize and start the sketch loop
const sketch = new SketchLoop(
  canvasData.ctx,
  canvasData.width,
  canvasData.height,
  inputHandler
);

// Start the animation
sketch.start();

// Optional: Log setup for debugging
console.log('Studio Engine started.');
console.log('Signal: mouse X position');
console.log('Parameter: ring radius');
console.log('Behavior: ring pulses faster as radius grows');
