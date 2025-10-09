# Test Linear Integration Workflow

This is a test file to verify that all GitHub workflows are working correctly:

## Workflows to Test

### 1. Sentinel Code Review
- Should detect security issues in test files
- Should post comments with 🔴🟠🟡🟢 priority markers
- Should block merge if CRITICAL issues found

### 2. Linear Integration
- Should detect Sentinel's priority markers
- Should create Linear issues automatically
- Should post feedback on PR with Linear issue links

### 3. CodeRabbit AI Review
- Should provide code quality analysis
- Should suggest improvements
- Should work alongside Sentinel

## Test Cases

### Security Test Files
- `.sentinel-tests/test-api-key.js` - Contains fake API keys
- `.sentinel-tests/test-password.js` - Contains fake passwords

### Expected Results
1. **Sentinel** should detect CRITICAL security issues
2. **Linear Integration** should create issues for CRITICAL findings
3. **CodeRabbit** should provide code quality feedback
4. **PR** should be blocked until security issues are resolved

## Linear Configuration
- **Team:** Vitraya-ak
- **Team ID:** b5835b14-c3cd-4048-b42a-7a7502647f4b
- **Workflow:** `.github/workflows/linear-integration.yml`

## GitHub Secrets Required
- `LINEAR_API_KEY` - Linear API key
- `LINEAR_TEAM_ID` - Team ID (configured)

---

**Test Date:** October 9, 2025
**Purpose:** Verify all AI review agents and Linear integration are working correctly
