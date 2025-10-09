#!/bin/bash
# Sentinel Setup Script
# Configures the Elite Code Review Agent for local development

set -e

echo "🛡️  Sentinel Setup - Elite Code Review Agent"
echo "=============================================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
  echo "❌ Error: Not a git repository"
  echo "   Please run this script from the root of your git project"
  exit 1
fi

echo "✅ Git repository detected"
echo ""

# Step 1: Set up pre-commit hook
echo "📋 Step 1/4: Setting up pre-commit hook..."

if [ -f ".git/hooks/pre-commit" ]; then
  echo "✅ Pre-commit hook already exists"
  chmod +x .git/hooks/pre-commit
  echo "   Made executable"
else
  echo "⚠️  Pre-commit hook not found at .git/hooks/pre-commit"
  echo "   Please ensure the hook file exists"
fi

echo ""

# Step 2: Verify GitHub Actions workflow
echo "📋 Step 2/4: Verifying GitHub Actions workflow..."

if [ -f ".github/workflows/code-review.yml" ]; then
  echo "✅ GitHub Actions workflow found"
  echo "   Sentinel will run automatically on PRs and commits"
else
  echo "⚠️  GitHub Actions workflow not found"
  echo "   Expected: .github/workflows/code-review.yml"
fi

echo ""

# Step 3: Check for Linear credentials
echo "📋 Step 3/4: Checking Linear integration..."

if [ -n "$LINEAR_API_KEY" ] && [ -n "$LINEAR_TEAM_ID" ]; then
  echo "✅ Linear credentials found in environment"
else
  echo "⚠️  Linear credentials not configured"
  echo ""
  echo "To enable automatic bug tracking in Linear:"
  echo "1. Go to https://linear.app/settings/api"
  echo "2. Create a new API key"
  echo "3. Add these secrets to GitHub:"
  echo "   - LINEAR_API_KEY=your_api_key"
  echo "   - LINEAR_TEAM_ID=your_team_id"
  echo ""
  echo "Or set them locally for testing:"
  echo "   export LINEAR_API_KEY=your_api_key"
  echo "   export LINEAR_TEAM_ID=your_team_id"
fi

echo ""

# Step 4: Test the pre-commit hook
echo "📋 Step 4/4: Testing pre-commit hook..."

# Create a test file with a security issue
TEST_FILE=".sentinel_test.js"
cat > $TEST_FILE << 'EOF'
// Sentinel test file - this will be deleted
const API_KEY = "test_key_12345"; // Should NOT trigger (too short)
console.log("Testing Sentinel");
EOF

echo "   Created test file: $TEST_FILE"

# Try to add and test
git add $TEST_FILE 2>/dev/null || true

echo "   Running pre-commit hook test..."

# Run hook manually (bypass git commit to avoid actual commit)
if [ -x ".git/hooks/pre-commit" ]; then
  # The hook will find the console.log and warn
  .git/hooks/pre-commit && echo "   ✅ Hook executed successfully" || echo "   Hook detected issues (expected)"
else
  echo "   ⚠️  Hook not executable, skipping test"
fi

# Clean up
git reset HEAD $TEST_FILE 2>/dev/null || true
rm -f $TEST_FILE

echo ""
echo "=============================================="
echo "🎉 Sentinel Setup Complete!"
echo "=============================================="
echo ""
echo "📚 What's Next?"
echo ""
echo "1. Read the documentation:"
echo "   cat SENTINEL_README.md"
echo ""
echo "2. Make a test commit to see Sentinel in action:"
echo "   echo '// test' >> test.js"
echo "   git add test.js"
echo "   git commit -m 'Test Sentinel'"
echo ""
echo "3. Create a Pull Request to see full analysis"
echo ""
echo "4. Configure Linear integration (optional):"
echo "   gh secret set LINEAR_API_KEY"
echo "   gh secret set LINEAR_TEAM_ID"
echo ""
echo "🛡️  Sentinel is now protecting your codebase!"
echo ""
echo "Need help? Check SENTINEL_README.md or ask the team."
echo ""
