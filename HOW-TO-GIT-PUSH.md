# How to Git Push Your Project

## Step 1: Check if Git is Initialized

In your terminal, navigate to your project folder and check:

```bash
cd C:\Users\simme\Documents\mycodei\afcawebsite
git status
```

If you see "not a git repository", you need to initialize first (see Step 2).
If you see file listings, you're good to go (skip to Step 3).

## Step 2: Initialize Git (If Needed)

If Git isn't initialized yet:

```bash
git init
```

## Step 3: Create .gitignore File (IMPORTANT!)

**Before committing, create a `.gitignore` file** to exclude sensitive files:

Create a file named `.gitignore` in your project root with:

```
# Environment variables (NEVER commit these!)
.env

# Node modules
node_modules/

# Logs
*.log
npm-debug.log*

# Database files
registrations.json

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
```

This prevents committing sensitive data like your Stripe keys and MongoDB password!

## Step 4: Add Files to Git

Add all your files:

```bash
git add .
```

Or add specific files:

```bash
git add index.html
git add dingolay.html
git add register.html
git add server.js
git add package.json
# etc.
```

## Step 5: Commit Your Changes

```bash
git commit -m "Add Dingolay 2026 registration system with Stripe and MongoDB"
```

Use a descriptive message about what you're committing.

## Step 6: Add Remote Repository (If Not Already Added)

If you haven't connected to a remote repository yet:

### Option A: GitHub

1. Create a repository on GitHub (if you haven't)
2. Copy the repository URL
3. Add it as remote:

```bash
git remote add origin https://github.com/yourusername/your-repo-name.git
```

### Option B: Check Existing Remote

Check if you already have a remote:

```bash
git remote -v
```

If you see a URL, you're already connected!

## Step 7: Push to Remote

Push your code:

```bash
git push -u origin main
```

Or if your branch is called `master`:

```bash
git push -u origin master
```

## Complete Workflow Example

```bash
# 1. Navigate to project
cd C:\Users\simme\Documents\mycodei\afcawebsite

# 2. Check status
git status

# 3. Add files
git add .

# 4. Commit
git commit -m "Add registration system with payment processing"

# 5. Push
git push -u origin main
```

## Troubleshooting

### "fatal: not a git repository"
- Run `git init` first

### "fatal: No remote repository"
- Add a remote: `git remote add origin YOUR_REPO_URL`

### "error: failed to push"
- Make sure you're logged into GitHub/GitLab
- Check your remote URL: `git remote -v`
- You might need to authenticate

### "Updates were rejected"
- Someone else pushed changes
- Pull first: `git pull origin main`
- Then push again: `git push origin main`

## Important Security Notes

⚠️ **NEVER commit:**
- `.env` file (contains your Stripe keys and MongoDB password)
- `node_modules/` folder (too large, can be reinstalled)
- `registrations.json` (contains user data)

✅ **Always commit:**
- HTML files
- CSS files
- JavaScript files (except .env)
- `package.json`
- `server.js`
- Documentation files

## Quick Checklist

- [ ] Created `.gitignore` file
- [ ] Added `.env` to `.gitignore`
- [ ] Initialized git (`git init`) if needed
- [ ] Added remote repository
- [ ] Added files (`git add .`)
- [ ] Committed changes (`git commit -m "message"`)
- [ ] Pushed to remote (`git push`)

## Need to Create a GitHub Repository?

1. Go to: https://github.com
2. Click "+" → "New repository"
3. Name it (e.g., "afca-website")
4. Don't initialize with README (you already have files)
5. Copy the repository URL
6. Use it in Step 6 above

That's it! 🚀

