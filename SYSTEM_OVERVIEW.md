# REUSABLE STUDIO ENGINE — COMPLETE BUILD

## EXECUTIVE SUMMARY

You have built a disciplined, reusable template for Canvas-based creative experimentation. The system investigates **signal vs. noise** through radical reduction:

- **One input signal:** Mouse X position
- **One parameter:** Ring radius (10–200 pixels)
- **One behavior:** Pulse speed increases with radius
- **One visual form:** White ring on black background

The template is production-ready, fully documented, and designed to be copied at the start of future projects.

---

## SYSTEM INTENT

**Core Idea:** A single horizontal human input transforms into visible rhythmic tension.

**What It Proves:** Control produces rhythm. Variation produces intensity. Noise is anything that does not clarify the signal.

**Aesthetic:** Restraint. Clarity over spectacle.

**Readability Test:** Move mouse left to right. Within 5 seconds, the ring clearly pulses faster. The connection between input and output is legible.

---

## ARCHITECTURE & CODE BREAKDOWN

### File Organization

```
reusable-studio-engine/
├─ index.html                    (13 lines) Entry point. Loads scripts in dependency order.
├─ style.css                     (39 lines) Minimal. Black background. Full-screen canvas.
├─ main.js                       (27 lines) Orchestrator only. Wires modules together.
│
├─ src/canvas/
│  ├─ setupCanvas.js           (36 lines) HiDPI scaling. Returns {ctx, width, height, dpr}.
│  └─ loop.js                   (75 lines) Animation loop. update() maps signal→parameter.
│                                          draw() renders white ring on black. No noise.
│
├─ src/input/
│  └─ input.js                  (72 lines) Captures mouse X/Y. Exposes getMouseX().
│
├─ src/utils/
│  └─ math.js                   (42 lines) Utility functions (lerp, mapRange, clamp, etc.).
│
├─ assets/                       (empty) For future images, audio, models.
│
├─ docs/
│  ├─ SYSTEM_CHARTER.md         (34 lines) Intent + constraints + tensions + taste vow.
│  ├─ ROADMAP.md                (44 lines) 6-step workflow to use template. 15 min total.
│  └─ PROMPTS.md               (122 lines) Copilot templates. Strict accountability rule.
│
└─ process/
   ├─ changelog.md              (68 lines) Meaningful thresholds + decision log.
   └─ screenshots/
      ├─ CAPTURE_INSTRUCTIONS.sh (Guide for capturing 00, 01, 02, 03 screenshots)
      ├─ 00-structure.png       (TO BE CAPTURED: VS Code file tree)
      ├─ 01-first-run.png       (TO BE CAPTURED: localhost running)
      ├─ 02-deploy-live.png     (TO BE CAPTURED: live deployed site)
      └─ 03-readme.png          (TO BE CAPTURED: README documentation)
```

### Core Code Flow

1. **index.html** loads all scripts in order (utils → canvas → input → main)
2. **main.js** initializes three components:
   - `setupCanvas()` → canvas context with HiDPI scaling
   - `new InputHandler()` → listens for mouse movement
   - `new SketchLoop(ctx, w, h, inputHandler)` → starts animation loop
3. **SketchLoop.start()** enters requestAnimationFrame loop:
   - `update()`: reads mouse X, maps to radius, updates pulse speed
   - `draw()`: clears black canvas, draws white ring at center
4. **Input** continuously updates mouseX, which feeds into update()

### Signal → Parameter → Behavior

```javascript
// update() - SIGNAL MAPPING
const normalizedX = mouseX / width;           // 0 to 1
this.radius = 10 + (normalizedX * 190);     // 10 to 200 pixels
this.pulseSpeed = 0.01 + (normalizedX * 0.04); // speed increases

// draw() - BEHAVIOR RENDERING
const pulseAmount = Math.sin(pulsePhase) * 0.3;
const currentRadius = radius * (1 + pulseAmount); // breathing effect
// draw white ring at currentRadius
```

---

## DESIGN DECISIONS

### Why This Signal?
Mouse X is immediate, responsive, and universally available. It maps cleanly to horizontal space → visual radius change.

### Why This Behavior?
Pulse speed tied to radius makes the connection obvious: move right = bigger ring = faster pulse. The behavior answers the question "what does this parameter do?" in under 5 seconds.

### Why Pure Canvas?
No external libraries means the engine is portable, lightweight, and future-proof. No build step. No dependencies to manage.

### Why Modular Files?
Each file has one job. When building a new project from this template, you modify only what needs to change (input signal, draw form, behavior math). No monolithic file to untangle.

### Why HiDPI Scaling?
Retina displays exist. The system should render cleanly on all devices. devicePixelRatio scaling is the standard.

### Why Black Background + White Ring?
Maximum contrast. Zero decoration. Perfect legibility. The aesthetic matches the philosophy: remove everything except the signal.

### Why No Center Dot?
It was noise. The ring alone is sufficient. The constraint improved clarity.

---

## DOCUMENTATION PHILOSOPHY

Every documentation file serves a purpose:

- **SYSTEM_CHARTER.md** — Your source of truth. Define intent before code.
- **ROADMAP.md** — The exact workflow you use to start projects. Literal steps.
- **PROMPTS.md** — Rules for asking AI for help. Enforces modular code + explanation.
- **README.md** — How to run, deploy, and use this template. Everything a user needs.
- **changelog.md** — Record meaningful decisions. Why did we do this? What was the threshold?

**Tone:** Professional. Clear. Intentional. No fluff. No filler language.

---

## DEPLOYMENT OPTIONS

### Option 1: GitHub Pages (Simple)
```bash
# Push to GitHub
git remote add origin https://github.com/[user]/reusable-studio-engine.git
git push -u origin main

# Enable Pages in repo Settings
# Settings → Pages → Deploy from main branch, / folder
# Live at: https://[user].github.io/reusable-studio-engine
```

### Option 2: Cloudflare Pages (Recommended)
```bash
# Push to GitHub first

# Then in Cloudflare Dashboard
# Workers & Pages → Create Project → Connect GitHub
# Select your repo
# Build settings:
#   Framework: None
#   Build command: (leave blank)
#   Output directory: /

# Live at: https://reusable-studio-engine-[random].pages.dev
# Updates automatically on every push
```

Both options deploy the root folder as-is. No build tools needed.

---

## COMMIT HISTORY

```
ff066f9  docs: verification checklist + screenshot capture instructions
4f9cf75  fix: black background, white ring, remove center dot noise
9162843  docs: setup complete summary
077ad12  add: deployment guide + gitignore
7d5d140  canvas: hidpi setup + animation loop + docs complete
0d2b8f4  init engine structure + docs skeleton
a5fa5ab  Initial commit
```

Commits mark real thresholds:
1. Structure scaffolding
2. Canvas engine working
3. Input integrated
4. Aesthetic refinement
5. Deployment + documentation

---

## HOW TO USE THIS TEMPLATE

### When a new assignment drops:

1. **Copy** the template (1 min)
   ```bash
   git clone https://github.com/[user]/reusable-studio-engine my-new-project
   cd my-new-project
   ```

2. **Define intent** (2 min)
   - Edit `/docs/SYSTEM_CHARTER.md`
   - Write your new signal, parameter, behavior
   - Save

3. **Build smallest version** (5 min)
   - Edit `/src/canvas/loop.js` to draw your form
   - Edit `/src/input/input.js` to capture your signal
   - Run locally. Test.

4. **Iterate** (3 min)
   - Tweak the math in `update()`
   - Watch the behavior change
   - Repeat until legible

5. **Deploy** (1 min)
   - Commit
   - Push
   - Live

**Total time:** ~15 minutes from template copy to live link.

---

## VERIFICATION CHECKLIST

✓ Exactly one signal (mouse X)  
✓ Exactly one parameter (radius)  
✓ Exactly one behavior (pulse speed tied to radius)  
✓ Exactly one visual form (white ring on black)  
✓ Behavior legible in under 5 seconds  
✓ Pure Canvas API only  
✓ No external libraries  
✓ HiDPI scaling implemented  
✓ Modular file architecture  
✓ Clear code comments  
✓ Complete documentation  
✓ Deployment instructions clear  
✓ No unnecessary code  
✓ No decorative additions  
✓ Aesthetic: minimal, deliberate, disciplined  

---

## WHAT "COMPLETE" MEANS

The engine is complete when:

1. **Code runs** without errors in any browser
2. **Signal shows up** in output (mouse X → ring response)
3. **Behavior is legible** within 5 seconds (pulse clearly accelerates left→right)
4. **Documentation exists** for every file and decision
5. **Deployment works** (live link is public)
6. **Screenshots captured** as process evidence
7. **Submissions made** with both GitHub + live links

---

## NEXT STEPS FOR SUBMISSION

1. Push this repo to GitHub
2. Configure GitHub Pages or Cloudflare Pages deployment
3. Capture 4 screenshots to `/process/screenshots/`:
   - 00-structure.png (VS Code file tree)
   - 01-first-run.png (localhost running)
   - 02-deploy-live.png (deployed site)
   - 03-readme.png (README visible)
4. Commit screenshots
5. Submit assignment with:
   - GitHub repo URL
   - Live deployment URL

---

## PHILOSOPHICAL FOUNDATION

This engine embodies a creative practice:

**Clarity before complexity.** Define what you want before you build it.  
**Intent before code.** Write your system charter first. Code follows.  
**Signal before noise.** Everything must clarify the input. Remove decorative impulse.  
**Structure before spectacle.** Clean architecture enables fast iteration.  
**Discipline before freedom.** Constraints make meaning possible.

The template is not a one-time project. It is a reusable instrument. Every time you copy it, you inherit its philosophy and extend it.

---

**Status: Ready for deployment and final submission**

*Built February 20, 2026*
