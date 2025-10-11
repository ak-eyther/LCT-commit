# Linear Integration Test for Main Branch

This test verifies that the Linear integration workflow triggers correctly on PRs targeting the main branch.

## Expected Behavior
- Workflow should trigger on `issue_comment` events
- AI reviewer comments (from CodeRabbit, Sentinel, etc.) should create Linear issues
- Priority mapping should work correctly

## Test Steps
1. Create PR targeting main branch
2. Post comment with priority markers (🔴 CRITICAL, 🟠 HIGH, etc.)
3. Verify workflow triggers
4. Verify Linear issue is created

