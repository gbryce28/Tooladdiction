# Reusable Studio Engine

A minimal, modular Canvas template for rapid project iteration. Copy it. Define your intent. Run. Deploy within 15 minutes.

## What This Is

A template repo that proves your creative idea works before you build a project around it. Signal → Parameter → Behavior.

**Signal:** Mouse X position (0 to window width)  
**Parameter:** Ring radius (10 to 200 pixels)  
**Behavior:** The ring pulses. Faster as you move right. Slower as you move left.

Move your mouse left to right. Within 5 seconds, you see the connection: position controls pulse speed.

## How to Run Locally

### Option 1: Open directly
```bash
open index.html
```

### Option 2: Use a local server (recommended for testing)
```bash
python3 -m http.server 8000
# Visit http://localhost:8000 in your browser
```

The canvas fills your screen. Move your mouse. The ring responds immediately.

## How to Deploy

This template supports two deployment paths:

### Option A: Cloudflare Pages (recommended)
1. Push this repo to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Navigate to Pages → Create a project
4. Connect to your GitHub repo
5. Build settings:
   - Framework: None
   - Build command: (leave blank)
   - Output directory: / (root)
6. Save and deploy. Every push updates your live link.

### Option B: GitHub Pages
1. Go to your repo Settings → Pages
2. Deploy from branch: `main`
3. Folder: `/ (root)`
4. Save. Your site will be live at `https://[username].github.io/[repo-name]`

## How I Use This to Start Projects

**Step 1:** Copy the template (2 min)
```bash
git clone https://github.com/[your-username]/reusable-studio-engine my-next-project
cd my-next-project
```

**Step 2:** Define intent (2 min)
- Edit `/docs/SYSTEM_CHARTER.md`
- Describe your signal, parameter, and expected behavior
- Save before you code

**Step 3:** Build the smallest thing (5 min)
- Edit `/src/canvas/loop.js` to draw your visual form
- Edit `/src/input/input.js` to capture your signal
- Reload the browser. Does it work?

**Step 4:** Iterate (3 min)
- Adjust the math in `update()` to map signal → parameter
- Does the behavior feel right?
- Test. Tweak. Repeat.

**Step 5:** Deploy (1 min)
- Commit: `git commit -m "behavior working"`
- Push: `git push`
- Link is live.

**Total:** 15 minutes from template to shareable link.

## File Architecture

```
reusable-studio-engine/
├─ index.html              Entry point. Loads scripts in order.
├─ main.js                 Orchestrator. Wires components.
├─ style.css               Minimal styling. Canvas full-screen.
├─ src/
│  ├─ canvas/
│  │  ├─ setupCanvas.js    HiDPI scaling. Returns ctx + dimensions.
│  │  └─ loop.js           Animation loop. Calls update() + draw().
│  ├─ input/
│  │  └─ input.js          Captures mouse. Exposes signal getters.
│  └─ utils/
│     └─ math.js           Utility functions (lerp, mapRange, etc.)
├─ docs/
│  ├─ SYSTEM_CHARTER.md    Your intent + constraints. Edit this first.
│  ├─ ROADMAP.md           The workflow you just read.
│  └─ PROMPTS.md           Copilot templates (your rules for AI help).
├─ assets/                 (images, audio, models — add as needed)
└─ process/
   ├─ changelog.md         Log what changed and why.
   └─ screenshots/         Evidence: 00-structure, 01-first-run, etc.
```

## Key Rules

1. **One signal only** – no overload. Pick one input gesture (mouse X, time, pressure).
2. **Pure Canvas, no libraries** – vanilla JavaScript. Keep it portable.
3. **Annotate every change** – if Copilot generates code, you explain it in plain language first.
4. **Structure + Flow** – folders stay clean. Code stays readable.

## What "Working" Means

Within 5 seconds of running, I can see:
- The canvas is rendering (no black screen)
- The signal affects the parameter (moving your mouse does something visible)
- The behavior is legible (the connection between input and output is clear)

If you can't see that in 5 seconds, the sketch is not done.

## Next Steps

1. Copy this template for your next project
2. Rewrite the signal in `/docs/SYSTEM_CHARTER.md`
3. Update `/src/canvas/loop.js` with your behavior
4. Run locally. Commit. Deploy.
5. Share the link.

---

**Built with the Studio Engine philosophy:** Clarity before complexity. Intent before code. Signal before noise.
