# 🧪 Sentinel Testing Guide

**How to verify Sentinel is working correctly**

---

## Quick Test (2 minutes)

### Option 1: Automated Test Suite

```bash
# Run the automated test suite
./test-sentinel.sh

# This will:
# ✅ Create test files with intentional security issues
# ✅ Run Sentinel's pre-commit hook
# ✅ Show which issues were detected
# ✅ Clean up automatically
```

### Option 2: Manual Quick Test

```bash
# Create a file with a hardcoded API key
echo 'const API_KEY = "sk_live_1234567890abcdefghij";' > test-security.js

# Try to commit it
git add test-security.js
git commit -m "Test Sentinel"

# Expected: Sentinel BLOCKS the commit with CRITICAL error
# Clean up: rm test-security.js
```

---

## Detailed Testing

### Test 1: Local Pre-Commit Hook

**Purpose:** Verify Sentinel blocks bad commits locally

**Steps:**
1. Create a test file with a security issue
2. Stage and commit
3. Observe Sentinel blocking it

**Example:**
```bash
# Create test file
cat > test-bad-code.js << 'EOF'
const password = "admin123";
const API_KEY = "sk_live_abcdefghijklmnopqrstuvwxyz";

function login() {
  return fetch('/api/login', {
    body: JSON.stringify({ password })
  });
}
EOF

# Try to commit
git add test-bad-code.js
git commit -m "Test commit"

# Expected output:
# 🔍 Sentinel Code Review - Running pre-commit checks...
# 🔐 Running security checks...
# 🔴 CRITICAL: Hardcoded password detected in test-bad-code.js
# 🔴 CRITICAL: Hardcoded API key detected in test-bad-code.js
# ⛔ COMMIT BLOCKED - CRITICAL SECURITY ISSUES DETECTED
```

**Expected Result:** ✅ Commit is BLOCKED

**Clean up:**
```bash
git reset HEAD test-bad-code.js
rm test-bad-code.js
```

---

### Test 2: GitHub Actions (PR Review)

**Purpose:** Verify Sentinel reviews PRs and adds comments

**Steps:**
1. Create a new branch
2. Add test file with issues
3. Push and create PR
4. Check for Sentinel comments

**Example:**
```bash
# Create branch
git checkout -b test-sentinel-pr

# Create test file
cat > security-test.js << 'EOF'
// SQL Injection vulnerability
function getUser(id) {
  return db.query("SELECT * FROM users WHERE id = " + id);
}

// Missing error handling
async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}
EOF

# Commit and push
git add security-test.js
git commit -m "Test Sentinel PR review" --no-verify
git push origin test-sentinel-pr

# Create PR on GitHub
gh pr create --title "Test Sentinel" --body "Testing automated review"
```

**Expected Results:**
- ✅ Sentinel posts a comment on the PR
- ✅ Comment includes security issues found
- ✅ Inline comments on problematic lines
- ✅ PR status shows "Changes requested" or "Failed check"
- ✅ Linear issues created (if configured)

**What to look for in PR:**
```markdown
## 🛡️ Sentinel Code Review Results

**Files Reviewed:** 1

### 🔴 CRITICAL Issues (1)
- SQL Injection in security-test.js:3

### 🟠 HIGH Issues (1)
- Missing error handling in security-test.js:8

⛔ **PR BLOCKED** - Fix critical issues before merge
```

**Clean up:**
```bash
git checkout qa
git branch -D test-sentinel-pr
git push origin --delete test-sentinel-pr
```

---

### Test 3: All Detection Categories

**Purpose:** Verify Sentinel detects all types of issues

#### 3.1 Security Issues (CRITICAL)

**Test Hardcoded Secrets:**
```javascript
// Should be detected
const API_KEY = "sk_live_51H8xYz1234567890";
const password = "supersecret";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
```

**Test SQL Injection:**
```javascript
// Should be detected
const query = "SELECT * FROM users WHERE name = " + userName;
db.execute(`DELETE FROM posts WHERE id = ${postId}`);
```

**Test XSS:**
```javascript
// Should be detected
element.innerHTML = userInput;
eval(userCode);
document.write(untrustedData);
```

**Test Disabled Security:**
```javascript
// Should be detected
const agent = { rejectUnauthorized: false };
auth = false;
```

#### 3.2 Accessibility Issues (HIGH)

**Test Missing Alt Text:**
```html
<!-- Should be detected -->
<img src="logo.png" />
<img src="banner.jpg" width="100" />
```

**Test Missing Labels:**
```html
<!-- Should be detected -->
<input type="text" placeholder="Name" />
<input type="email" />
```

**Test Removed Focus:**
```css
/* Should be detected */
button:focus {
  outline: none;
}

*:focus {
  outline: 0;
}
```

#### 3.3 Code Quality Issues (MEDIUM)

**Test Console Statements:**
```javascript
// Should be detected
console.log('Debug info');
console.debug('Testing');
console.info('Information');
```

**Test TODO Comments:**
```javascript
// Should be detected
// TODO: Fix this later
// FIXME: Broken logic
// HACK: Temporary workaround
```

**Test Missing Error Handling:**
```javascript
// Should be detected
async function loadData() {
  const data = await fetch('/api/data');
  return data.json();
}
```

---

### Test 4: Good Code (Should Pass)

**Purpose:** Verify Sentinel allows secure code

```javascript
// This should PASS all checks
import { config } from './config';

async function processInvoice(invoiceData) {
  try {
    // Validate input
    if (!invoiceData || !invoiceData.id) {
      throw new Error('Invalid invoice data');
    }

    // Use environment variables for secrets
    const apiKey = process.env.LCT_API_KEY;
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Parameterized query (prevents SQL injection)
    const invoice = await db.query(
      'SELECT * FROM invoices WHERE id = ?',
      [invoiceData.id]
    );

    // Sanitize output
    return {
      success: true,
      data: sanitizeInvoiceData(invoice)
    };
  } catch (error) {
    // Proper error handling without exposing details
    logger.error('Invoice processing failed', { invoiceId: invoiceData?.id });
    return {
      success: false,
      error: 'Failed to process invoice'
    };
  }
}
```

**Expected:** ✅ Sentinel allows commit, no blocking issues

---

### Test 5: Linear Integration (Optional)

**Purpose:** Verify issues are created in Linear

**Prerequisites:**
- `LINEAR_API_KEY` set in GitHub secrets
- `LINEAR_TEAM_ID` set in GitHub secrets

**Steps:**
1. Push code with CRITICAL or HIGH issues
2. Check Linear for auto-created issues

**Expected in Linear:**
- ✅ New issue created with title: `[Sentinel] {Type} in {file}:{line}`
- ✅ Priority set correctly (CRITICAL = Urgent, HIGH = High)
- ✅ Description includes code snippet and fix recommendation
- ✅ Links back to GitHub PR/commit

**Verify in Linear:**
1. Go to your Linear workspace
2. Search for issues with label `sentinel-critical` or `sentinel-high`
3. Open issue and verify:
   - Title format is correct
   - Description is detailed
   - Code snippet is included
   - GitHub link works
   - Priority is correct

---

## Testing Checklist

Use this checklist to verify all Sentinel features:

### Local Pre-Commit Hook
- [ ] Hook file exists at `.git/hooks/pre-commit`
- [ ] Hook is executable (`chmod +x`)
- [ ] Blocks CRITICAL security issues
- [ ] Warns about HIGH issues
- [ ] Shows MEDIUM issues as info
- [ ] Allows bypass with `--no-verify`

### GitHub Actions Workflow
- [ ] Workflow file exists at `.github/workflows/code-review.yml`
- [ ] Triggers on PR creation
- [ ] Triggers on push to main/qa/develop
- [ ] Posts summary comment
- [ ] Adds inline comments on issues
- [ ] Fails check if CRITICAL issues found

### Security Detection
- [ ] Detects hardcoded API keys
- [ ] Detects hardcoded passwords
- [ ] Detects SQL injection patterns
- [ ] Detects XSS vulnerabilities
- [ ] Detects disabled auth/SSL
- [ ] Detects unsafe `eval()` usage

### UI/UX Detection
- [ ] Detects missing alt text on images
- [ ] Detects inputs without labels
- [ ] Detects removed focus indicators
- [ ] Checks WCAG 2.2 guidelines

### Functional Detection
- [ ] Detects console.log statements
- [ ] Detects TODO/FIXME comments
- [ ] Detects missing error handling
- [ ] Detects async functions without try-catch

### Linear Integration
- [ ] Creates issues for CRITICAL findings
- [ ] Creates issues for HIGH findings
- [ ] Sets correct priority levels
- [ ] Includes code snippets
- [ ] Links to GitHub PR/commit
- [ ] Adds appropriate labels

---

## Troubleshooting Tests

### "Pre-commit hook didn't run"

**Check:**
```bash
# Verify hook exists
ls -la .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit

# Test manually
.git/hooks/pre-commit
```

### "Hook ran but didn't detect issues"

**Verify patterns:**
```bash
# Check if pattern exists in file
grep -n "password" test-file.js
grep -n "sk_live_" test-file.js

# View hook logic
cat .git/hooks/pre-commit | grep -A5 "check_secrets"
```

### "GitHub Action didn't trigger"

**Check:**
1. Go to GitHub → Actions tab
2. Look for "Elite Code Review Bot" workflow
3. Check if it's enabled
4. View logs for errors

**Common issues:**
- Workflow file syntax error
- Branch not in trigger list
- Permissions not set correctly

### "Linear issues not created"

**Check secrets:**
```bash
# List secrets
gh secret list

# Should show:
# LINEAR_API_KEY
# LINEAR_TEAM_ID
```

**Verify API key:**
```bash
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: YOUR_LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"{ viewer { id name } }"}'
```

---

## Performance Testing

### Test Large Files

```bash
# Create large file
for i in {1..1000}; do
  echo "console.log('Line $i');" >> large-test.js
done

# Test Sentinel performance
time git add large-test.js
time git commit -m "Test large file"

# Expected: < 5 seconds for 1000 lines
```

### Test Multiple Files

```bash
# Create multiple test files
for i in {1..20}; do
  echo "const password = 'test';" > test-file-$i.js
done

# Test batch processing
time git add test-file-*.js
time git commit -m "Test multiple files"

# Expected: < 10 seconds for 20 files
```

---

## Test Reports

After running tests, document results:

```markdown
## Sentinel Test Report - [Date]

**Environment:**
- OS: [macOS/Linux/Windows]
- Git Version: [version]
- Node Version: [version]

**Test Results:**
- Pre-commit Hook: ✅ PASS / ❌ FAIL
- GitHub Actions: ✅ PASS / ❌ FAIL
- Security Detection: ✅ PASS / ❌ FAIL
- UI/UX Detection: ✅ PASS / ❌ FAIL
- Functional Detection: ✅ PASS / ❌ FAIL
- Linear Integration: ✅ PASS / ❌ FAIL / ⚠️ NOT CONFIGURED

**Issues Found:**
1. [Issue description]
2. [Issue description]

**Recommendations:**
1. [Recommendation]
2. [Recommendation]
```

---

## Continuous Testing

**Weekly Test:**
```bash
# Run automated test suite
./test-sentinel.sh

# Review results
# Update patterns if needed
```

**Monthly Review:**
- Check false positive rate
- Review detection patterns
- Update for new vulnerabilities
- Verify Linear integration
- Check team feedback

---

## Next Steps After Testing

1. **If all tests pass:** Sentinel is working correctly! ✅
2. **If tests fail:** Review troubleshooting section above
3. **Document findings:** Create test report
4. **Train team:** Share results and best practices
5. **Monitor in production:** Track Sentinel's effectiveness

---

## Questions?

- **Documentation:** `SENTINEL_README.md`
- **Quick Start:** `SENTINEL_QUICK_START.md`
- **Agent Details:** `.claude/agents/code-reviewer.md`
- **Run Tests:** `./test-sentinel.sh`

---

**Remember:** Sentinel is protecting your healthcare platform. Test it thoroughly to ensure it's working correctly!

🛡️ **Test often. Stay secure.**
