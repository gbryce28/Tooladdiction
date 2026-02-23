# System Charter: Reusable Studio Engine

## Intent
A template that proves any signal can drive a canvas behavior, making project startup instant and iteration disciplined.

## Constraints
1. **One signal only** – no overloaded input. The template captures exactly one meaningful gesture (e.g., mouse X, time, pressure).
2. **Pure Canvas, no libraries** – vanilla JavaScript and Canvas API only. This keeps the engine lightweight and portable.
3. **Modular by default** – each file has a single job (setup, loop, input, math). No tangled dependencies.

## Tensions to Hold
- **Signal vs. Noise**: The sketch proves what matters. Extra features are noise.
- **Structure vs. Flow**: Folders organize the work; the code must run immediately without ceremony.

## Taste Vow
I refuse to generate code without explaining it. Every template I publish includes plain-language comments about what changed and why. No copy-paste dumps.

---

## Template Sketch: Signal → Parameter → Behavior

**Signal:** Mouse X position (horizontal movement)  
**Parameter:** Ring radius (how large the circle grows)  
**Behavior:** The ring pulses—faster as the radius grows, slower as it shrinks  
**Readability test:** Move left to right. Within 5 seconds, you see the pulse clearly accelerate. Move back. It decelerates. The connection is legible.

### Visual Form
One concentric ring that lives at screen center, scaled and pulsed by input.

---

## Why This Matters
When a new assignment drops, you open this template, copy it, rename one file, define your own signal, and run. No decisions about structure. No boilerplate. You inherit the ritual and extend it.
