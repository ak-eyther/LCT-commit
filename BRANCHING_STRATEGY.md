# Branching Strategy - LCT Success Matrix Project

## 📋 Overview

This project uses a **simple, lightweight Git workflow** optimized for small teams working on HTML applications with Vercel deployment.

**Philosophy:** Keep it simple. This is a single HTML file project, not a complex application. The strategy provides safety without unnecessary overhead.

---

## 🌳 Branch Structure

### Simple Structure

```
main (production)
  ↓
feature/*, fix/* (short-lived, 1-2 days max)
```

**That's it!** No develop branch, no complex workflows.

### Branch Descriptions

| Branch | Purpose | Deploys To | Protected |
|--------|---------|------------|-----------|
| `main` | Production code | Vercel Production | ⚠️ Optional |
| `feature/*` | New features | Local/Preview | ❌ No |
| `fix/*` | Bug fixes | Local/Preview | ❌ No |

---

## 🚀 Daily Workflow

### Starting New Work

```bash
# Pull latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/duplicate-detection

# Or for bug fix
git checkout -b fix/export-csv-bug
```

### Branch Naming Convention

Format: `<type>/<short-description>`

**Types:**
- `feature/` - New functionality
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code cleanup

**Examples:**
```
feature/tariff-validation
feature/fraud-detection-ui
fix/invoice-validation-bug
fix/export-csv-encoding
docs/update-readme
refactor/cleanup-css
```

### Working on Your Branch

```bash
# Make changes and test
# Open lct-tracker-html.html in browser to test

# Stage and commit
git add .
git commit -m "Add invoice validation logic

Implements criteria #4 (CRITICAL) - Invoice amount precedence.
LCT amount takes priority over ETIMS and Document amounts.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to remote
git push -u origin feature/duplicate-detection
```

### Merging to Main

**Option 1: Direct Merge (Fast, for solo work)**
```bash
# After testing locally
git checkout main
git merge feature/duplicate-detection
git push origin main

# Clean up
git branch -d feature/duplicate-detection
git push origin --delete feature/duplicate-detection
```

**Option 2: Pull Request (Recommended for team work)**
```bash
# Push your branch
git push origin feature/duplicate-detection

# Create PR via GitHub web interface
# Review → Approve → Merge → Delete branch
```

---

## 📝 Commit Message Format

Keep it simple but informative:

```
<type>: <short summary>

[Optional detailed description]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code cleanup

### Examples

**Simple:**
```
fix: Correct CSV export encoding

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Detailed:**
```
feat: Add duplicate service detection

Implements criteria #11 (CRITICAL) - Repeated service detection.
Detects identical tests/medications across providers within 7 days.

Relates to: #11, #15

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🎯 Best Practices

### DO ✅

- **Test in browser before committing** - Open HTML file, verify it works
- **Keep branches short-lived** - 1-2 days max
- **One feature per branch** - Don't mix unrelated changes
- **Write clear commit messages** - Future you will thank you
- **Delete merged branches** - Keep repo clean
- **Commit often** - Small commits are easier to track

### DON'T ❌

- **Commit broken code** - Always test first
- **Mix multiple features** - One thing at a time
- **Use vague messages** - "fix stuff" tells us nothing
- **Let branches go stale** - Merge or delete within days
- **Force push to main** - Never do this

---

## 🔍 Common Scenarios

### Scenario 1: Quick Fix

```bash
# For small urgent fixes
git checkout main
git pull origin main
git checkout -b fix/typo-in-label

# Fix the typo
# Test in browser

git add .
git commit -m "fix: Correct typo in criteria label"
git push origin fix/typo-in-label

# Merge via PR or directly
git checkout main
git merge fix/typo-in-label
git push origin main
```

### Scenario 2: Working on Multiple Features

```bash
# Feature 1
git checkout -b feature/tariff-validation
# Work and commit

# Switch to Feature 2 (without finishing Feature 1)
git checkout main
git checkout -b feature/fraud-detection
# Work and commit

# Switch back to Feature 1
git checkout feature/tariff-validation
# Continue work
```

### Scenario 3: Main Has New Changes

```bash
# Update your feature branch with latest main
git checkout main
git pull origin main

git checkout feature/your-feature
git merge main
# Resolve conflicts if any
git push origin feature/your-feature
```

### Scenario 4: Oops, Broke Production

```bash
# Quick revert
git checkout main
git revert <bad-commit-hash>
git push origin main

# Or create fix
git checkout -b fix/urgent-production-fix
# Fix the issue
# Test thoroughly
git push origin fix/urgent-production-fix
# Merge immediately
```

---

## 🚀 Deployment Flow

```
Developer → feature/xxx
              ↓
           Test locally (open HTML in browser)
              ↓
           Push to GitHub
              ↓
           Merge to main → Vercel Production (auto-deploy)
```

### Vercel Integration

- **Main branch** → Automatically deploys to production
- **Feature branches** → Can preview if needed (optional)

---

## 🛡️ Branch Protection (Optional)

For `main` branch, you CAN add protection (but not required for solo work):

**Minimal Protection:**
- ✅ Require pull request before merging (optional)
- ❌ Approvals: Not needed for solo work
- ✅ Do not allow force push (recommended)

**How to enable:**
- Go to: https://github.com/ak-eyther/LCT-commit/settings/branches
- Add rule for `main`
- Enable only what you need

---

## 📊 Branch Lifecycle

```
Created → Work → Test → Push → Merge → Delete
   ↓        ↓      ↓      ↓       ↓       ↓
  1hr    1-2 days  5min   1min   1min   1min
```

**Target Timeline:**
- Feature development: 1-2 days
- Testing: 5 minutes (open HTML in browser)
- Merge: Fast
- **Total cycle: < 3 days**

---

## 📚 Quick Reference

```bash
# Daily workflow
git checkout main                # Start from main
git pull origin main             # Get latest
git checkout -b feature/name     # Create branch
# [work and test in browser]
git add .                        # Stage changes
git commit -m "message"          # Commit
git push origin feature/name     # Push

# Merge (simple way)
git checkout main
git merge feature/name
git push origin main

# Merge (PR way)
# Use GitHub web interface

# Cleanup
git branch -d feature/name       # Delete local
git push origin --delete feature/name  # Delete remote

# Check status
git status                       # Current state
git branch                       # List branches
git log --oneline -5             # Recent commits
```

---

## 💡 Why This Simplified Approach?

### Perfect for:
- ✅ Single HTML file projects
- ✅ Small teams (1-3 people)
- ✅ Fast iteration needed
- ✅ Learning Git basics
- ✅ Projects where testing = opening file in browser

### Not suitable for:
- ❌ Large applications with build processes
- ❌ Teams of 10+ developers
- ❌ Complex deployment pipelines
- ❌ Projects requiring extensive QA

### Your LCT Project:
- 🎯 Single HTML file
- 🎯 LocalStorage (no database)
- 🎯 No build process
- 🎯 Test by opening in browser
- 🎯 Small team
- **✅ Perfect fit for simple workflow!**

---

## 🎓 Learning Resources

- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Vercel Git Integration](https://vercel.com/docs/concepts/git)

---

## 🆘 Need Help?

**Common Issues:**

**"I committed to main by accident"**
```bash
# It's okay! Just revert
git revert HEAD
git push origin main
```

**"My branch is out of date"**
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

**"I want to undo my last commit"**
```bash
# Undo but keep changes
git reset --soft HEAD~1

# Undo and discard changes (careful!)
git reset --hard HEAD~1
```

---

**Remember:** For a simple HTML app, simple Git workflow is best. Don't overcomplicate it!

Happy coding! 🚀
