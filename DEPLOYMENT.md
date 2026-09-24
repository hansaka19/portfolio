# GitHub Deployment & Setup Guide

This document records the steps performed to setup, push, and publish the **3D Portfolio** project on GitHub Pages.

---

## 📌 Repository Details

- **GitHub Repository URL:** [https://github.com/hansaka19/portfolio.git](https://github.com/hansaka19/portfolio.git)
- **Live Site URL (GitHub Pages):** [https://hansaka19.github.io/portfolio/](https://hansaka19.github.io/portfolio/)

---

## 🛠️ Summary of Initial Setup Actions

1. **Git Repository Initialization**:
   - Initialized Git tracking on branch `main`.
2. **Ignored Large/Temporary Files (`.gitignore`)**:
   - Excluded `.DS_Store`, source `.blend`, `.blend1` raw Blender files to prevent repo bloat and stay within GitHub upload limits.
3. **Remote Configuration**:
   - Connected local workspace to `https://github.com/hansaka19/portfolio.git`.
4. **Initial Code Push**:
   - Staged and committed project assets (`index.html`, `character.glb`, `assets/`, `README.md`).
   - Cleanly updated remote `main` branch.

---

## 🚀 GitHub Pages Publishing Steps

To host the portfolio directly on GitHub Pages:

1. Open [https://github.com/hansaka19/portfolio](https://github.com/hansaka19/portfolio).
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `/ (root)`
4. Click **Save**.

---

## 💻 Commands for Future Code Updates

When making future changes to the portfolio locally, run the following commands in the terminal to push updates to GitHub:

```bash
# 1. Check status of changed files
git status

# 2. Stage modified files
git add .

# 3. Commit changes with a descriptive message
git commit -m "Update portfolio assets and styling"

# 4. Push updates to GitHub
git push origin main
```
