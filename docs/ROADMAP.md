# Roadmap: How to Use This Template

This is your personal ritual for starting any new assignment in under 15 minutes.

## Step 1: Copy the Template
- Clone this repo.
- Rename locally: `cp -r reusable-studio-engine my-next-project`.
- Open in VS Code.

## Step 2: Define Your Intent (2 minutes)
- Open `/docs/SYSTEM_CHARTER.md`.
- Rewrite the "Template Sketch" section with your signal, parameter, and behavior.
- Save your intent before you touch code.

## Step 3: Sketch the System in Words (1 minute)
- Update `/docs/PROMPTS.md` with your context block.
- Paste your SYSTEM_CHARTER signal definition into the first prompt template.

## Step 4: Build Smallest Working Version (5 minutes)
- Modify `src/canvas/setupCanvas.js` to match your visual form (dot, ring, line, sigil).
- Modify `src/input/input.js` to read your chosen signal.
- Update `src/canvas/loop.js` to connect signal → parameter → behavior.
- Run locally. Prove it works.

## Step 5: Iterate Through Visible Tests (3 minutes)
- Does the signal show up in the output?
- Does the behavior feel right?
- Adjust the math. Re-run.

## Step 6: Polish After Meaning is Legible (1 minute)
- Update README with your specific signal and behavior.
- Commit.
- Deploy.

---

**Total time:** ~15 minutes from template copy to live link.

**Key rule:** Every step is reversible. You keep `/docs/` as your source of truth. Code follows intent, not the reverse.
