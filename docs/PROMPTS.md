# Copilot Prompt Templates

This file controls how you ask for technical help. Every response must be followed by your plain-language explanation of what changed and why.

---

## Context Block (copy + paste this at the start of every Copilot request)

```
I am building a reusable Canvas sketch engine.

Structure:
- /src/canvas/setupCanvas.js → HiDPI scaling, returns canvas + context
- /src/canvas/loop.js → runs requestAnimationFrame, calls draw()
- /src/input/input.js → captures mouse/input signals
- /src/utils/math.js → utility functions (distance, lerp, etc.)
- main.js → wires everything together

Current signal: mouse X position
Current parameter: ring radius
Current behavior: ring pulses (speed tied to radius)

The sketch must run immediately in any browser. No build step. Pure Canvas.
```

---

## Template 1: Canvas Draw Loop

```
Signal context: [YOUR SIGNAL AND EXPECTED RANGE]

I need to update loop.js to:
1. Read the current signal value from the input handler
2. Map that signal to my parameter (e.g., normalize 0-1 range)
3. Update the visual behavior (e.g., change ring radius or pulse speed)
4. Clear and redraw each frame

Write only the update() function that manages this state. Include comments explaining the signal → parameter → behavior flow.
```

**My rule:** After Copilot responds, I write a comment like:
```js
// This function updates the parameter (radius) based on signal (mouse X).
// Signal range: 0 to window.innerWidth
// Parameter range: 10 to 200 pixels
// Behavior: larger radius → faster pulse
```

---

## Template 2: Input Mapping

```
Signal definition: [DESCRIBE YOUR SIGNAL]

I need to create (or update) input.js to:
1. Listen for [mouse/touch/keyboard/time]
2. Extract the raw value [what exactly is the number?]
3. Normalize it to 0-1 range (or specify your desired range)
4. Expose it as a getter or callback so loop.js can use it

Write only the functions needed. Keep it minimal.
```

**My rule:** After Copilot responds, I verify:
- The signal is actually being read (console.log it)
- The range makes sense (log normalized value)
- It connects to the behavior in loop.js

---

## Template 3: Debugging the Signal

```
Behavior issue: [describe what is NOT happening]

Current signal flow:
- Input: [raw signal value and range]
- Parameter: [expected value]
- Behavior: [what should happen vs. what actually happens]

Debug questions:
1. Is the signal being read? (I will add console.log)
2. Is the parameter updated correctly? (I will log it)
3. Is the draw() function using the parameter? (I will check the loop)

Write a minimal test in loop.js that logs each step, so I can trace where the flow breaks.
```

**My rule:** Every log message is labeled. I trace the signal from input → parameter → visual output.

---

## Rule: Annotate Everything

When Copilot generates code:
1. Copy it into your file.
2. Add a comment above or below explaining what it does in plain language.
3. If you don't understand a line, ask Copilot to explain it before moving on.
4. Update `/process/changelog.md` with what changed and why.

Example:
```js
// This normalizes mouse X (0 to window width) into a 0-1 range.
// We use it to scale the ring radius from 10 to 200 pixels.
const normalizedX = currentMouseX / window.innerWidth;
const radius = 10 + (normalizedX * 190);
```

---

## No Copy-Paste Dumps

If Copilot generates a full file or large block of code:
- Read it line by line.
- Understand the logic before you paste.
- Break it into labeled sections with comments.
- Test each part as it's added.

This is creative agency. The code belongs to you. You explain it to yourself first.
