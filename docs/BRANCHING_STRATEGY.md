# Branching Strategy - LCT commit

## 📋 Overview

This project uses a **simple, lightweight Git workflow with QA gate** optimized for small teams working on HTML applications with Vercel deployment and AI-powered code review.

**Philosophy:** Keep it simple, but safe. This is a single HTML file project, not a complex application. The QA branch adds a quality gate with automated AI review (Sentinel + CodeRabbit) before production, without adding complexity.

---

## 🌳 Branch Structure

### Simple Structure

```
main (production)
  ↑
  QA (pre-production testing & AI review)
  ↑
feature/*, fix/* (short-lived, 1-2 days max)
```

**Enhanced with QA!** Simple workflow with quality gate before production.

### Branch Descriptions

| Branch      | Purpose                          | Deploys To                 | Protected   |
| ----------- | -------------------------------- | -------------------------- | ----------- |
| `main`      | Production code                  | Vercel Production          | ⚠️ Optional |
| `QA`        | Pre-production testing & AI review | Vercel Preview (QA)      | ⚠️ Optional |
| `feature/*` | New features                     | Local/Preview              | ❌ No       |
| `fix/*`     | Bug fixes                        | Local/Preview              | ❌ No       |

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

### Merging to QA for Testing

**Recommended workflow with QA gate:**

```bash
# After testing locally
git checkout QA
git pull origin QA
git merge feature/duplicate-detection
git push origin QA

# AI reviewers (Sentinel, CodeRabbit) automatically review
# Test on QA environment
# Wait for AI review results
```

### Promoting QA to Main (Production)

**After successful QA testing:**

```bash
# Merge QA to main
git checkout main
git pull origin main
git merge QA
git push origin main

# Clean up feature branch
git branch -d feature/duplicate-detection
git push origin --delete feature/duplicate-detection
```

**Alternative: Pull Request Workflow (Recommended for team work)**

```bash
# Push your feature branch
git push origin feature/duplicate-detection

# Create PR to QA via GitHub web interface
# AI Review (Sentinel + CodeRabbit) runs automatically
# After approval → Merge to QA

# Test on QA environment

# Create PR from QA to main
# Final review → Merge → Deploy to production
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
- **Merge to QA before main** - Always use the quality gate
- **Wait for AI review results** - Check Sentinel and CodeRabbit feedback
- **Keep branches short-lived** - 1-2 days max
- **One feature per branch** - Don't mix unrelated changes
- **Write clear commit messages** - Future you will thank you
- **Delete merged branches** - Keep repo clean
- **Commit often** - Small commits are easier to track

### DON'T ❌

- **Commit broken code** - Always test first
- **Skip QA branch** - Never merge feature branches directly to main
- **Ignore AI review comments** - Fix critical and high priority issues
- **Mix multiple features** - One thing at a time
- **Use vague messages** - "fix stuff" tells us nothing
- **Let branches go stale** - Merge or delete within days
- **Force push to main or QA** - Never do this

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

# Merge to QA for AI review
git checkout QA
git pull origin QA
git merge fix/typo-in-label
git push origin QA

# After AI review passes, merge to main
git checkout main
git pull origin main
git merge QA
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

### Scenario 4: QA Testing Before Production

```bash
# Merge feature to QA for testing
git checkout QA
git pull origin QA
git merge feature/tariff-validation
git push origin QA

# Wait for AI reviewers (Sentinel, CodeRabbit) to complete
# Test on QA environment
# If issues found, fix them on the feature branch and repeat

# Once QA passes, promote to main
git checkout main
git pull origin main
git merge QA
git push origin main
```

### Scenario 5: Oops, Broke Production

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
# Merge to QA first, then main
```

### Scenario 6: Sync QA with Main

```bash
# If main has hotfixes that QA doesn't have
git checkout QA
git pull origin QA
git merge main
git push origin QA
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
           Merge to QA → Vercel Preview (QA) + AI Review (Sentinel, CodeRabbit)
              ↓
           Test on QA environment
              ↓
           Merge to main → Vercel Production (auto-deploy)
```

### Vercel Integration

- **Main branch** → Automatically deploys to production
- **QA branch** → Deploys to QA preview environment for testing
- **Feature branches** → Can preview if needed (optional)

---

## 🛡️ Branch Protection (Optional)

For `main` and `QA` branches, you CAN add protection (but not required for solo work):

**Minimal Protection:**

- ✅ Require pull request before merging (optional)
- ❌ Approvals: Not needed for solo work
- ✅ Do not allow force push (recommended)
- ✅ Require status checks to pass (Sentinel, CodeRabbit reviews)

**How to enable:**

- Go to: https://github.com/ak-eyther/LCT-commit/settings/branches
- Add rule for `main` and `QA`
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
# Daily workflow with QA gate
git checkout main                # Start from main
git pull origin main             # Get latest
git checkout -b feature/name     # Create branch
# [work and test in browser]
git add .                        # Stage changes
git commit -m "message"          # Commit
git push origin feature/name     # Push

# Merge to QA for testing
git checkout QA
git pull origin QA
git merge feature/name
git push origin QA
# Wait for AI review (Sentinel, CodeRabbit)
# Test on QA environment

# Promote QA to main (after testing passes)
git checkout main
git pull origin main
git merge QA
git push origin main

# Cleanup
git branch -d feature/name       # Delete local
git push origin --delete feature/name  # Delete remote

# Check status
git status                       # Current state
git branch                       # List branches
git log --oneline -5             # Recent commits
```

---

## 💡 Why This QA-Enhanced Approach?

### Perfect for:

- ✅ Single HTML file projects
- ✅ Small teams (1-3 people)
- ✅ Fast iteration needed
- ✅ AI-powered code review (Sentinel, CodeRabbit)
- ✅ Quality gate before production
- ✅ Healthcare/financial applications requiring compliance
- ✅ Projects where testing = opening file in browser

### Not suitable for:

- ❌ Large applications with complex build processes
- ❌ Teams of 10+ developers
- ❌ Complex multi-environment pipelines

### Your LCT Project:

- 🎯 Single HTML file
- 🎯 LocalStorage (no database)
- 🎯 No build process
- 🎯 Test by opening in browser
- 🎯 Small team
- 🎯 Healthcare claims = compliance required
- 🎯 AI-powered security & quality checks
- **✅ Perfect fit for QA-enhanced workflow!**

### Why Add QA Branch?

1. **Automated AI Review**: Sentinel and CodeRabbit automatically review all code before production
2. **Security Compliance**: Healthcare PHI/PII requires security checks (OWASP Top 10)
3. **Linear Integration**: Issues auto-created from AI reviews for tracking
4. **Quality Gate**: Catch bugs before production without manual reviews
5. **LCT Requirement**: 90% accuracy target needs quality assurance

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
