# AI Collaboration Record

## Project
- Repo: https://github.com/gbryce28/Studioengine
- Deployed link (if applicable): (pending deployment)
- Date started: February 20, 2026

## My constraints (before any AI)
- Intent (1 sentence): Build a reusable Canvas template that proves any single signal can drive a visible behavior with immediate legibility.
- Constraints (3):
  1. One signal only (mouse X position)
  2. Pure Canvas API, no libraries
  3. Modular architecture with single-responsibility files
- Tension (1): Structure vs. Flow — folders organize the work, but code must run immediately without ceremony
- Taste vow (1): I refuse to generate code without explaining it in plain language. No decorative noise.

---

## Entry Log

### Entry 01 — February 20, 2026
**My next move (write before AI):**
- Create project directory structure with modular separation
- Write SYSTEM_CHARTER defining intent, constraints, tensions
- Establish documentation before any code exists

**Files touched:**
- `/docs/SYSTEM_CHARTER.md`
- `/docs/ROADMAP.md`
- `/docs/PROMPTS.md`
- Directory structure: `/src/canvas`, `/src/input`, `/src/utils`, `/process`

**Copilot prompt (paste exact prompt):**
```
I need to create documentation files for a reusable Canvas template engine.

Context: Building a disciplined instrument that maps one signal (mouse X) to one parameter (radius) producing one behavior (pulse speed).

Target: Generate SYSTEM_CHARTER.md with:
- One sentence intent
- Three constraints (one signal, pure Canvas, modular files)
- Two tensions (signal vs noise, structure vs flow)
- One taste vow rejecting decorative excess

Constraints: Keep language clear, direct, professional. No fluff.

Acceptance test: The charter makes the creative philosophy legible in under 1 minute of reading.
```

**Copilot output (summarize in 3–6 bullets):**
- Made the SYSTEM_CHARTER file with the main idea
- Wrote down the three rules (one signal, Canvas only, separate files)
- Added the two tensions I want to explore
- Included my taste vow about not adding unexplained code

**My translation (what changed and why):**
- Wrote down my creative idea before coding anything
- Made the "one signal only" rule clear so I don't add too much stuff later
- Set up folders to keep things organized

**Signal / Noise:**
- Signal: Got my goals written down clearly. Can change things if I need to.
- Noise: None yet since I haven't coded anything.

**Next right action (one sentence):**
- Build the Canvas setup so it looks sharp on retina screens.

---

### Entry 02 — February 20, 2026
**My next move (write before AI):**
- Create setupCanvas.js with HiDPI scaling for retina displays
- Implement animation loop that calls update() and draw()
- Keep canvas setup separate from rendering logic

**Files touched:**
- `/src/canvas/setupCanvas.js`
- `/src/canvas/loop.js`
- `index.html`
- `style.css`

**Copilot prompt (paste exact prompt):**
```
Context: Building a reusable Canvas engine. Need HiDPI scaling and animation loop.

Target: Create setupCanvas.js that:
1. Gets devicePixelRatio
2. Scales canvas internal resolution
3. Scales context to CSS pixel coordinates
4. Returns { canvas, ctx, width, height, dpr }

Constraints: Pure Canvas API. No libraries. Single responsibility (just setup, no drawing).

Acceptance test: Canvas renders sharp on retina displays without blur.
```

**Copilot output (summarize in 3–6 bullets):**
- Made setupCanvas.js that checks for retina displays
- Scales the canvas so it looks sharp not blurry
- Returns all the canvas info I need
- Added comments explaining what it does

**My translation (what changed and why):**
- setupCanvas.js just sets up the canvas, nothing else
- The devicePixelRatio thing fixes blurriness on retina screens
- Makes the canvas look good on my MacBook display

**Signal / Noise:**
- Signal: Canvas starts up correctly. Each file does one thing.
- Noise: None. Everything's simple.

**Next right action (one sentence):**
- Make the loop file that actually draws the ring.

---

### Entry 03 — February 20, 2026
**My next move (write before AI):**
- Create input handler that captures mouse X position
- Expose getter functions for normalized signal values
- Keep input logic separate from canvas rendering

**Files touched:**
- `/src/input/input.js`
- `/src/utils/math.js`

**Copilot prompt (paste exact prompt):**
```
Context: Building signal-driven Canvas engine. Mouse X position controls ring radius and pulse speed.

Target: Create input.js class that:
1. Listens for mousemove events
2. Stores raw mouseX and mouseY
3. Exposes getMouseX() and getNormalizedMouseX() methods
4. No drawing logic, just signal capture

Constraints: Single responsibility. No global state. Clean event binding.

Acceptance test: Console.log shows mouseX updates on movement.
```

**Copilot output (summarize in 3–6 bullets):**
- Made an InputHandler class that watches the mouse
- Saves mouse X and Y positions
- Has functions to get mouse position (raw and 0-1 range)
- Added cleanup methods

**My translation (what changed and why):**
- InputHandler just tracks the mouse, doesn't do anything else
- The 0-1 range makes the math easier later
- Added cleanup so I don't get memory problems

**Signal / Noise:**
- Signal: Mouse tracking works. Got both regular and 0-1 values.
- Noise: Added a click tracker I'm not using yet (but might use later).

**Next right action (one sentence):**
- Connect the mouse position to the ring size.

---

### Entry 04 — February 20, 2026
**My next move (write before AI):**
- Connect input signal to canvas behavior
- Map mouse X to ring radius (10-200px)
- Tie pulse speed to radius size

**Files touched:**
- `/src/canvas/loop.js`
- `main.js`

**Copilot prompt (paste exact prompt):**
```
Context: Canvas engine where mouse X controls ring radius, and radius controls pulse speed.

Target: Implement loop.js class with:
1. update() function that reads inputHandler.getMouseX()
2. Maps signal to radius parameter (10 to 200 pixels)
3. Pulse speed increases with radius
4. draw() renders white ring on black background using sine wave pulse

Constraints: One signal. One visual form (ring). No extra animations. Clear canvas each frame.

Acceptance test: Moving mouse left to right makes ring grow and pulse faster visibly within 5 seconds.
```

**Copilot output (summarize in 3–6 bullets):**
- Made a SketchLoop class with update() and draw() functions
- Takes mouse X and turns it into 0-1 range
- Maps that to ring size (10-200 pixels) and pulse speed
- Uses Math.sin for the pulsing effect

**My translation (what changed and why):**
- update() gets the mouse position and figures out the ring size
- Bigger ring = faster pulse, which makes the connection obvious
- Math.sin makes it pulse smoothly like breathing

**Signal / Noise:**
- Signal: Mouse controls ring size which controls pulse. You can see it right away.
- Noise: Made a weird motion blur effect and added a center dot I don't need.

**Next right action (one sentence):**
- Fix the colors and remove the extra dot.

---

### Entry 05 — February 20, 2026
**My next move (write before AI):**
- Change background to pure black
- Change ring to pure white
- Remove center dot (decorative noise)
- Use opaque clear instead of motion blur

**Files touched:**
- `/src/canvas/loop.js`
- `style.css`

**Copilot prompt (paste exact prompt):**
```
Context: Canvas ring sketch violates aesthetic constraints. Needs correction.

Target: Fix loop.js draw() function:
1. Clear with solid black (#000), not semi-transparent white
2. Ring stroke should be pure white (#fff), not gray
3. Remove center dot (it's noise)
4. Keep everything else the same

Constraints: Minimal changes. No new features.

Acceptance test: Black background, white ring, no dot. Behavior unchanged.
```

**Copilot output (summarize in 3–6 bullets):**
- Changed background to solid black
- Made the ring pure white instead of gray
- Deleted the center dot code
- Everything else stayed the same

**My translation (what changed and why):**
- Black background makes the white ring way easier to see
- Got rid of the motion blur by using solid colors
- Removed the center dot because it's just extra stuff
- Now it looks clean like I wanted

**Signal / Noise:**
- Signal: Looks clean now. You can clearly see mouse position controls the ring.
- Noise: Deleted the dot and motion blur. No extra stuff anymore.

**Next right action (one sentence):**
- Check that all my docs are done and commit everything.

---

### Entry 06 — February 20, 2026
**My next move (write before AI):**
- Verify README includes deployment instructions
- Confirm ROADMAP describes reusable workflow
- Ensure changelog documents decision rationale
- Create verification checklist

**Files touched:**
- `README.md`
- `/process/changelog.md`
- `SUBMISSION_CHECKLIST.md`

**Copilot prompt (paste exact prompt):**
```
Context: Studio engine is functionally complete. Need final documentation verification.

Target: Review README.md and ensure it includes:
1. One-sentence purpose statement
2. Local run instructions
3. GitHub Pages deployment steps
4. Cloudflare Pages deployment steps
5. Personal ritual for using template on future projects

Constraints: Keep tone clear, direct, professional. No marketing fluff.

Acceptance test: Someone copying this repo can deploy within 15 minutes using only the README.
```

**Copilot output (summarize in 3–6 bullets):**
- README has instructions for deploying to GitHub Pages and Cloudflare
- Added a section about how to use this template for new projects
- Explained where all the files go and why
- Made a checklist to verify everything's done

**My translation (what changed and why):**
- README now explains everything about how to use the template
- Deployment instructions are ready to copy and paste
- Added my workflow so I can reuse this for future assignments

**Signal / Noise:**
- Signal: Docs are clear and I can use this template again later. Everything's explained.
- Noise: None. All the docs actually help.

**Next right action (one sentence):**
- Commit everything and push to GitHub.

---

