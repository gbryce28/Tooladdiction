// input.js
// Captures and normalizes input signals (mouse position, touch, etc.)
// Provides getters for the current signal value.

class InputHandler {
  constructor() {
    this.mouseX = 0;
    this.mouseY = 0;
    this.isPressed = false;
    
    // Bind event listeners
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    
    this.attach();
  }
  
  attach() {
    // Listen for mouse movement
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
  }
  
  detach() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
  }
  
  onMouseMove(event) {
    // Update raw mouse position
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }
  
  onMouseDown(event) {
    this.isPressed = true;
  }
  
  onMouseUp(event) {
    this.isPressed = false;
  }
  
  // Getters: expose signals to the loop
  getMouseX() {
    return this.mouseX;
  }
  
  getMouseY() {
    return this.mouseY;
  }
  
  getIsPressed() {
    return this.isPressed;
  }
  
  // Normalized getters (0 to 1 range)
  getNormalizedMouseX() {
    return this.mouseX / window.innerWidth;
  }
  
  getNormalizedMouseY() {
    return this.mouseY / window.innerHeight;
  }
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputHandler;
}
