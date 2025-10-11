# Linear Integration Test for QA Branch

This is a test file to verify that the Linear integration workflow works correctly on the `qa` branch.

## Test Objectives

1. ✅ Verify Linear workflow exists on qa branch
2. ⏳ Verify workflow triggers on PR comments
3. ⏳ Verify Linear issues are created from AI reviewer comments
4. ⏳ Verify priority mapping works (🔴→P1, 🟠→P2, etc.)

## Expected Behavior

When an AI reviewer (CodeRabbit, Sentinel, etc.) posts a comment with priority markers:
- 🔴 CRITICAL → Linear Priority 1
- 🟠 HIGH → Linear Priority 2
- 🟡 MEDIUM → Linear Priority 3
- 🟢 LOW → Linear Priority 4

The workflow should:
1. Detect the AI comment
2. Parse the priority marker
3. Create a Linear issue in the "LCT commit" project
4. Post a comment on the PR with the Linear issue link

## Test Date
October 11, 2025

## Test Status
🧪 Testing in progress...
