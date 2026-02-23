// setupCanvas.js
// Initializes a HiDPI-aware Canvas with proper scaling for retina displays.
// Returns: { canvas, ctx, width, height, dpr } where dpr is device pixel ratio.

function setupCanvas() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // Get device pixel ratio for HiDPI (retina) displays
  const dpr = window.devicePixelRatio || 1;
  
  // Get desired canvas size in CSS pixels
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  
  // Scale canvas for HiDPI: set internal resolution higher
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  
  // Scale context to match (so drawing commands use CSS pixel coordinates)
  ctx.scale(dpr, dpr);
  
  return {
    canvas: canvas,
    ctx: ctx,
    width: width,
    height: height,
    dpr: dpr
  };
}

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = setupCanvas;
}
