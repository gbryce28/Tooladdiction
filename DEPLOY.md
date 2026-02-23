# Deployment Guide: Studio Engine

This document walks you through getting your Studio Engine live in one of two ways.

## Prerequisites
- This repo is ready to deploy as-is (no build step)
- You have a GitHub account
- You can choose Cloudflare Pages OR GitHub Pages (both are free and instant)

---

## Option A: Cloudflare Pages (Recommended)

**Why:** Instant updates on every push, fast global CDN, more reliable.

### Step 1: Push to GitHub
Make sure your code is on GitHub first:

```bash
# If not already on GitHub, create a new repo:
# 1. Go to github.com/new
# 2. Create repo named: reusable-studio-engine (or your chosen name)
# 3. Do NOT initialize with README (you already have one)

# Add remote (use the URL from your new GitHub repo):
git remote add origin https://github.com/[YOUR_USERNAME]/reusable-studio-engine.git
git branch -M main
git push -u origin main
```

### Step 2: Create Cloudflare Pages Project
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up for free (if you don't have an account)
3. Go to **Workers & Pages** → **Pages** → **Create a project**
4. Select **Connect to Git**
5. Authorize GitHub and select your `reusable-studio-engine` repo
6. Choose branch: `main`
7. **Build settings:**
   - Framework preset: **None**
   - Build command: **(leave empty)**
   - Output directory: **/ (root)**
8. Click **Save and Deploy**

Cloudflare will build your site. Within 2-3 minutes, you'll see a live link like:
```
https://reusable-studio-engine-abc123.pages.dev
```

**Every time you push to GitHub, your site updates automatically.**

---

## Option B: GitHub Pages

**Why:** Simple, integrated with GitHub, stable hosting.

### Step 1: Push to GitHub
```bash
# Add remote (if not done yet):
git remote add origin https://github.com/[YOUR_USERNAME]/reusable-studio-engine.git
git branch -M main
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repo on GitHub
2. Click **Settings**
3. Scroll down to **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: **Deploy from a branch**
   - Branch: **main** | Folder: **/ (root)**
5. Click **Save**

GitHub will deploy your site. Within 1-2 minutes, you'll see a live link like:
```
https://[YOUR_USERNAME].github.io/reusable-studio-engine
```

---

## Verify Deployment

After you choose your option, verify your live site:

1. Open the deployment link in your browser
2. You should see the white canvas with a centered ring
3. Move your mouse left to right
4. The ring should grow and pulse faster as you move right
5. If all that works, you're live! 🎉

---

## Update Workflow

After deployment, your workflow is:
```bash
# 1. Make changes locally
# 2. Test in browser (http://localhost:8000)
# 3. Commit
git add -A
git commit -m "update: [what changed]"

# 4. Push to GitHub
git push origin main

# 5. Your live site updates automatically (in a few seconds)
```

---

## Troubleshooting

**The ring doesn't respond to mouse movement:**
- Open browser DevTools (F12)
- Check the Console tab
- Look for any red errors
- If you see "setupCanvas is not defined", the scripts loaded out of order
- Verify all script tags in index.html are in the correct order

**The site is deployed but shows a blank page:**
- Check that you deployed from the root folder (/ or root), not /build or /dist
- Verify index.html is at the root of your repo
- Hard refresh the browser (Cmd+Shift+R on Mac)

**Deployment is slow:**
- Cloudflare Pages is usually faster than GitHub Pages
- First deployment might take 2-3 minutes
- Subsequent updates are instant

---

## Next: Use It

Once your template is live:
1. Save the deployment link
2. When a new assignment drops, copy this repo
3. Rewrite the signal in `/docs/SYSTEM_CHARTER.md`
4. Update `/src/canvas/loop.js` with your behavior
5. Push. Done.

**Total time from template copy to deployed live: ~15 minutes.**

---

*See README.md for the full project overview.*
