// math.js
// Utility math functions for common sketch operations.

// Linear interpolation: smoothly blend from a to b by t (0 to 1)
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Map a value from one range to another
// Example: mapRange(x, 0, 10, 0, 100) maps 0-10 input to 0-100 output
function mapRange(value, inMin, inMax, outMin, outMax) {
  const normalized = (value - inMin) / (inMax - inMin);
  return outMin + (normalized * (outMax - outMin));
}

// Constrain a value to a min/max range
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Distance between two points
function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Normalize a value (0 to 1 scale based on range)
function normalize(value, min, max) {
  return (value - min) / (max - min);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    lerp: lerp,
    mapRange: mapRange,
    clamp: clamp,
    distance: distance,
    normalize: normalize
  };
}
