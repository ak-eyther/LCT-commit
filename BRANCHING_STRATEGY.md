# Branching Strategy - LCT Success Matrix Project

## 📋 Overview

This project uses a **simplified Git Flow** strategy optimized for small teams and Vercel deployment.

---

## 🌳 Branch Structure

### Main Branches

```
main (production)
  ↓
develop (staging)
  ↓
feature/*, fix/*, hotfix/* (short-lived)
```

### Branch Descriptions

| Branch | Purpose | Deploys To | Protected |
|--------|---------|------------|-----------|
| `main` | Production-ready code | Vercel Production | ✅ Yes |
| `develop` | Integration & testing | Vercel Preview | ✅ Yes |
| `feature/*` | New features | Local/Dev Preview | ❌ No |
| `fix/*` | Bug fixes | Local/Dev Preview | ❌ No |
| `hotfix/*` | Urgent production fixes | Local/Dev Preview | ❌ No |

---

## 🔄 Workflow

### 1. Starting New Work

```bash
# Always start from develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/duplicate-detection

# Or for bug fix
git checkout -b fix/invoice-validation-bug

# Or for hotfix (from main)
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-patch
```

### 2. Branch Naming Convention

Format: `<type>/<short-description>`

**Types:**
- `feature/` - New functionality
- `fix/` - Bug fixes
- `hotfix/` - Critical production fixes
- `docs/` - Documentation only
- `refactor/` - Code refactoring
- `test/` - Adding tests

**Examples:**
```
feature/tariff-validation
feature/fraud-detection-ui
fix/invoice-amount-precedence
fix/export-csv-encoding
hotfix/security-vulnerability
docs/update-readme
refactor/cleanup-data-structure
test/add-unit-tests-criteria-4
```

### 3. Working on Your Branch

```bash
# Make changes
# Save often

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

### 4. Creating Pull Request

```bash
# Push your branch
git push origin feature/duplicate-detection

# Create PR via GitHub CLI (or web UI)
gh pr create --base develop --title "Add duplicate detection for repeated services" --body "$(cat <<'EOF'
## Summary
- Implements criteria #11 (CRITICAL): Repeated service detection
- Detects identical tests/medications across providers
- Flags services repeated within 7 days

## Changes Made
- Added `detectDuplicateServices()` function
- Updated UI to show duplicate warnings
- Added test cases for edge scenarios

## Test Plan
- [ ] Tested with sample data (CB-109764-25)
- [ ] Verified detection across multiple providers
- [ ] Confirmed 7-day window logic
- [ ] Exported results to CSV successfully

## Screenshots
[If applicable]

## Related Criteria
- #11: Repeated service detection (CRITICAL)
- #15: Cross-provider duplicate service (CRITICAL)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## ✅ Pull Request Process

### PR Review Checklist

**Before Creating PR:**
- [ ] Code runs without errors
- [ ] All tests pass (if applicable)
- [ ] Code is commented and readable
- [ ] Related to one or more of the 31 criteria
- [ ] Tested manually with sample data
- [ ] No console errors or warnings
- [ ] Follows beginner-friendly code style

**Reviewer Checks:**
- [ ] Code is clear and well-documented
- [ ] Aligns with project priorities
- [ ] No security vulnerabilities
- [ ] Works in browser/local environment
- [ ] Follows established patterns

### PR Approval & Merge

1. **At least 1 approval** required for develop
2. **At least 2 approvals** required for main
3. Use **Squash and Merge** to keep history clean
4. Delete branch after merging

---

## 🚀 Deployment Flow

```
Developer → feature/xxx
              ↓ (PR)
           develop → Vercel Preview (auto-deploy)
              ↓ (PR after testing)
            main → Vercel Production (auto-deploy)
```

### Vercel Integration

- **Develop branch** → Automatically deploys to preview URL
- **Main branch** → Automatically deploys to production
- **Feature branches** → Optional preview deployments

---

## 🔥 Hotfix Process

For critical production issues:

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-description

# 2. Fix the issue
# Make minimal changes only

# 3. Test thoroughly
# Verify fix works

# 4. Create PR to main
gh pr create --base main --title "HOTFIX: Critical bug description"

# 5. After merge to main, also merge to develop
git checkout develop
git pull origin main
git push origin develop
```

---

## 📝 Commit Message Format

```
<type>: <short summary>

<detailed description>

<footer>
```

### Examples

**Good:**
```
feat: Add invoice amount precedence validation

Implements criteria #4 (CRITICAL). LCT amount now takes
precedence over ETIMS and Document amounts. Flags Query
status when ETIMS < LCT.

Relates to: #4

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Also Good (Simple):**
```
fix: Correct CSV export encoding issue

Fixed UTF-8 encoding for special characters in member names.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, no code change
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 🎯 Best Practices

### DO ✅

- Keep branches small and focused
- One feature/fix per branch
- Update from develop regularly
- Write clear commit messages
- Test before creating PR
- Review PRs promptly
- Delete merged branches

### DON'T ❌

- Commit directly to main or develop
- Create long-lived feature branches
- Mix multiple features in one branch
- Use generic commit messages ("fix stuff", "update")
- Leave PRs open for weeks
- Merge without testing

---

## 🔍 Common Scenarios

### Scenario 1: Working on Multiple Features

```bash
# Feature 1
git checkout -b feature/tariff-validation
# Work and commit

# Switch to Feature 2 (without finishing Feature 1)
git checkout develop
git checkout -b feature/fraud-detection
# Work and commit

# Switch back to Feature 1
git checkout feature/tariff-validation
# Continue work
```

### Scenario 2: Develop Has New Changes

```bash
# Update your feature branch with latest develop
git checkout develop
git pull origin develop

git checkout feature/your-feature
git merge develop
# Resolve conflicts if any
git push origin feature/your-feature
```

### Scenario 3: Need to Fix Something in Production

```bash
# Use hotfix workflow
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# Fix, test, commit
git push origin hotfix/critical-issue

# Create PR to main (fast-track review)
# After merge to main, also update develop
```

---

## 📊 Branch Lifecycle

```
Created → In Progress → PR Open → Reviewed → Merged → Deleted
  ↓           ↓            ↓          ↓         ↓        ↓
 Day 1      Day 1-3      Day 3      Day 4    Day 5   Day 5
```

**Target Timeline:**
- Feature development: 1-3 days
- PR review: 1-2 days
- Total cycle: < 1 week

---

## 🛡️ Branch Protection Rules

### For `main` branch:
- ✅ Require pull request before merging
- ✅ Require 2 approvals
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Do not allow force push
- ✅ Do not allow deletion

### For `develop` branch:
- ✅ Require pull request before merging
- ✅ Require 1 approval
- ✅ Require status checks to pass
- ✅ Do not allow force push

---

## 🚨 Emergency Procedures

### If Someone Pushed to Main Directly

```bash
# Revert the commit
git checkout main
git revert <commit-hash>
git push origin main

# Recreate as proper branch
git checkout -b fix/reverted-change
# Apply changes correctly
# Create PR
```

### If Develop is Broken

```bash
# Option 1: Revert problematic commit
git checkout develop
git revert <bad-commit-hash>
git push origin develop

# Option 2: Create fix branch
git checkout -b fix/repair-develop
# Fix the issue
# Create emergency PR
```

---

## 📚 Quick Reference

```bash
# Common commands
git checkout develop           # Switch to develop
git pull origin develop        # Get latest changes
git checkout -b feature/name   # Create new branch
git add .                      # Stage all changes
git commit -m "message"        # Commit changes
git push origin branch-name    # Push to remote
gh pr create                   # Create PR (GitHub CLI)

# Check status
git status                     # See current changes
git branch                     # List local branches
git log --oneline -5           # Recent commits

# Cleanup
git branch -d feature/name     # Delete local branch
git fetch --prune              # Remove stale remote refs
```

---

## 🎓 Learning Resources

- [Git Branching Strategy](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI Documentation](https://cli.github.com/)
- [Vercel Git Integration](https://vercel.com/docs/concepts/git)

---

**Remember:** This strategy is designed for simplicity and speed. As the team grows, we can evolve these practices.

Happy branching! 🌿
