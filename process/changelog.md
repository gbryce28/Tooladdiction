# Process Changelog

## Milestone 1: Structure + Docs (Commit: 0d2b8f4)
Created the foundational project architecture:
- Directory structure: `/src`, `/docs`, `/process`
- Documentation: SYSTEM_CHARTER, ROADMAP, PROMPTS
- Core modules: setupCanvas, loop, input, math utils
- HTML entry point and styling

**Why:** Clarity before code. Intent is documented first. Code follows.

## Milestone 2: Canvas Engine Running
- setupCanvas.js initializes HiDPI scaling for retina displays
- loop.js implements the animation loop with signal → parameter → behavior flow
- input.js captures mouse position as the signal
- Ring pulses visibly in response to mouse X position

**Why:** Proof the system works. One signal. One clear visual response.

## Milestone 3: Input Wired + Tested
- Mouse X position (0 to window.width) normalized to radius parameter (10 to 200px)
- Pulse speed tied to radius (bigger ring = faster pulse)
- Browser console logs verify signal flow

**Why:** The connection between input and output is legible and testable.

## Milestone 4: Deployed Live
- Connected to Cloudflare Pages / GitHub Pages
- Live link is public and shareable
- Every push updates automatically

**Why:** Deployment is the proof. Classmates can open a link and see it run.

## Milestone 5: README + Screenshots
- README explains intent, workflow, and deployment options
- Screenshots document the journey: structure → local run → deployed → documented
- Process evidence saved for future reference

**Why:** The template is now reusable. Next time, copy and iterate in 15 minutes.

---

## Decision Log

**Signal choice: Mouse X**
- Simple, responsive, immediate visual feedback
- Works on desktop and touch (clientX still fires on mobile)
- Clear parameter: as you move right, the ring grows and pulses faster

**Visual form: Pulsing ring at screen center**
- Minimal, legible, zero distraction
- The signal → parameter → behavior connection is immediate
- Scalable: future projects can replace with dot, line, or other form

**Architecture: Modular files, not monolithic**
- setupCanvas, loop, input, utils are separate concerns
- Easier to iterate: change only what matters
- No dependencies on external libraries

**Deployment: Cloudflare Pages (recommended)**
- Instant deployment on every push
- No build step required (pure HTML/JS)
- Stable, fast, and free

---

*Last updated: February 20, 2026*
