#!/bin/bash

# LCT Commit Agent Setup Script
# This script sets up the hybrid agent architecture for the LCT-Vitraya project

set -e  # Exit on any error

echo "🤖 Setting up LCT Commit Agent System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "claude.md" ]; then
    print_error "This script must be run from the LCT-commit project root directory"
    exit 1
fi

print_status "Validating agent files exist..."

# Check if agent documentation exists
AGENT_FILES=(
    "docs/agents/README.md"
    "docs/agents/primary-developer.md"
    "docs/agents/code-reviewer-sentinel.md"
    "docs/agents/integrations.md"
)

for file in "${AGENT_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Missing agent file: $file"
        exit 1
    fi
    print_success "Found: $file"
done

print_status "Checking configuration files..."

# Check Cursor configuration
if [ -f ".cursor/rules/claude.md" ]; then
    if grep -q "docs/agents/" .cursor/rules/claude.md; then
        print_success "Cursor configuration references agent docs"
    else
        print_warning "Cursor configuration may need agent references"
    fi
else
    print_warning "No .cursor/rules/claude.md found"
fi

# Check Claude configuration
if [ -f ".claude/agents/code-reviewer.md" ]; then
    if grep -q "docs/agents/" .claude/agents/code-reviewer.md; then
        print_success "Claude configuration references agent docs"
    else
        print_warning "Claude configuration may need agent references"
    fi
else
    print_warning "No .claude/agents/code-reviewer.md found"
fi

print_status "Setting up pre-commit hooks..."

# Create pre-commit hook directory if it doesn't exist
mkdir -p .git/hooks

# Create pre-commit hook for Sentinel
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# LCT Commit Pre-commit Hook
# Runs Sentinel code review before commits

echo "🛡️ Running Sentinel pre-commit review..."

# Check if Sentinel script exists
if [ -f "scripts/sentinel-pre-commit.sh" ]; then
    ./scripts/sentinel-pre-commit.sh
    if [ $? -ne 0 ]; then
        echo "❌ Sentinel found CRITICAL issues. Commit blocked."
        echo "Fix the issues above and try again."
        echo "To bypass (use sparingly): git commit --no-verify"
        exit 1
    fi
    echo "✅ Sentinel review passed"
else
    echo "⚠️ Sentinel script not found. Skipping pre-commit review."
fi
EOF

chmod +x .git/hooks/pre-commit
print_success "Pre-commit hook installed"

print_status "Checking GitHub Actions..."

# Check if GitHub Actions workflows exist
if [ -d ".github/workflows" ]; then
    WORKFLOW_FILES=(
        "sentinel-pr-review.yml"
        "sentinel-commit-review.yml"
        "linear-integration.yml"
    )
    
    for workflow in "${WORKFLOW_FILES[@]}"; do
        if [ -f ".github/workflows/$workflow" ]; then
            print_success "Found workflow: $workflow"
        else
            print_warning "Missing workflow: $workflow"
        fi
    done
else
    print_warning "No .github/workflows directory found"
fi

print_status "Checking environment variables..."

# Check for required environment variables
REQUIRED_VARS=(
    "LINEAR_API_KEY"
    "LINEAR_TEAM_ID"
)

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        print_warning "Environment variable $var not set"
        echo "  Add to your .env file or export in shell"
    else
        print_success "Environment variable $var is set"
    fi
done

print_status "Creating agent setup validation..."

# Create a simple validation script
cat > scripts/validate-agents.sh << 'EOF'
#!/bin/bash

# Agent System Validation Script
# Checks if all agent components are working

echo "🔍 Validating LCT Commit Agent System..."

# Check agent files
AGENT_FILES=(
    "docs/agents/README.md"
    "docs/agents/primary-developer.md"
    "docs/agents/code-reviewer-sentinel.md"
    "docs/agents/integrations.md"
)

for file in "${AGENT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

# Check configuration files
CONFIG_FILES=(
    ".cursor/rules/claude.md"
    ".claude/agents/code-reviewer.md"
)

for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "⚠️ $file missing (optional)"
    fi
done

# Check pre-commit hook
if [ -f ".git/hooks/pre-commit" ]; then
    echo "✅ Pre-commit hook installed"
else
    echo "❌ Pre-commit hook missing"
fi

echo "🎉 Agent system validation complete!"
EOF

chmod +x scripts/validate-agents.sh
print_success "Validation script created"

print_status "Creating team onboarding checklist..."

# Create team onboarding checklist
cat > docs/TEAM_ONBOARDING.md << 'EOF'
# LCT Commit Team Onboarding

## Quick Start (5 minutes)

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd LCT-commit
   ```

2. **Run agent setup**
   ```bash
   ./scripts/agent-setup.sh
   ```

3. **Validate installation**
   ```bash
   ./scripts/validate-agents.sh
   ```

4. **Test with a simple commit**
   ```bash
   echo "test" > test.txt
   git add test.txt
   git commit -m "Test commit"
   git rm test.txt
   git commit -m "Clean up test"
   ```

## Agent System Overview

- **Primary Developer**: Interactive coding assistant (Cursor Chat)
- **Sentinel**: Automated code review (pre-commit, PRs)
- **Security Auditor**: Weekly security scans
- **Documentation Writer**: On-demand documentation updates

## Configuration Files

- **Universal Docs**: `docs/agents/` (works with any tool)
- **Cursor Config**: `.cursor/rules/claude.md`
- **Claude Config**: `.claude/agents/`
- **GitHub Actions**: `.github/workflows/`

## Environment Variables

Add to your `.env` file:
```bash
LINEAR_API_KEY=your_linear_api_key
LINEAR_TEAM_ID=your_team_id
```

## Troubleshooting

**If Sentinel blocks commits:**
1. Read the error message carefully
2. Fix the security issue
3. Commit again
4. Use `git commit --no-verify` only in emergencies

**If Cursor doesn't load agent context:**
1. Restart Cursor IDE
2. Check `.cursor/rules/claude.md` exists
3. Verify no syntax errors in claude.md

**If GitHub Actions fail:**
1. Check workflow syntax
2. Verify environment variables
3. Review GitHub Actions logs

## Getting Help

- **Agent Documentation**: `docs/agents/README.md`
- **Project Context**: `claude.md`
- **31 Success Criteria**: `lct-tracker-html.html`
- **Security Guide**: `SECURITY_BEST_PRACTICES.md`

## Next Steps

1. Read the agent documentation
2. Set up personal Cursor memories (optional)
3. Start working on CRITICAL priority items
4. Ask questions in team chat

Welcome to the LCT-Vitraya team! 🚀
EOF

print_success "Team onboarding guide created"

print_status "Creating test scripts..."

# Create Sentinel test script
cat > scripts/sentinel-pre-commit.sh << 'EOF'
#!/bin/bash

# Sentinel Pre-commit Review Script
# Basic security and quality checks

echo "🛡️ Running Sentinel pre-commit review..."

# Check for hardcoded secrets
if git diff --cached --name-only | xargs grep -l "sk_live_\|sk_test_\|password.*=" 2>/dev/null; then
    echo "❌ CRITICAL: Hardcoded secrets found"
    echo "Remove hardcoded API keys, passwords, or tokens"
    exit 1
fi

# Check for console.log statements
if git diff --cached --name-only | xargs grep -l "console\.log" 2>/dev/null; then
    echo "⚠️ WARNING: console.log statements found"
    echo "Remove or comment out console.log statements"
fi

# Check for TODO/FIXME comments
if git diff --cached --name-only | xargs grep -l "TODO\|FIXME" 2>/dev/null; then
    echo "⚠️ WARNING: TODO/FIXME comments found"
    echo "Consider addressing or documenting these items"
fi

# Check for basic security patterns
if git diff --cached --name-only | xargs grep -l "eval(\|innerHTML.*=" 2>/dev/null; then
    echo "❌ CRITICAL: Dangerous patterns found"
    echo "Remove eval() and unsafe innerHTML usage"
    exit 1
fi

echo "✅ Sentinel pre-commit review passed"
exit 0
EOF

chmod +x scripts/sentinel-pre-commit.sh
print_success "Sentinel pre-commit script created"

# Create Linear connection test script
cat > scripts/test-linear-connection.sh << 'EOF'
#!/bin/bash

# Test Linear API Connection
# Verifies Linear integration is working

echo "🔗 Testing Linear API connection..."

if [ -z "$LINEAR_API_KEY" ]; then
    echo "❌ LINEAR_API_KEY not set"
    echo "Add to your .env file: LINEAR_API_KEY=your_key"
    exit 1
fi

if [ -z "$LINEAR_TEAM_ID" ]; then
    echo "❌ LINEAR_TEAM_ID not set"
    echo "Add to your .env file: LINEAR_TEAM_ID=your_team_id"
    exit 1
fi

# Test Linear API connection
response=$(curl -s -H "Authorization: $LINEAR_API_KEY" \
    -H "Content-Type: application/json" \
    "https://api.linear.app/graphql" \
    -d '{"query": "query { viewer { id name } }"}')

if echo "$response" | grep -q "viewer"; then
    echo "✅ Linear API connection successful"
    echo "Connected as: $(echo "$response" | jq -r '.data.viewer.name')"
else
    echo "❌ Linear API connection failed"
    echo "Response: $response"
    exit 1
fi
EOF

chmod +x scripts/test-linear-connection.sh
print_success "Linear connection test script created"

print_status "Final validation..."

# Run the validation script
./scripts/validate-agents.sh

print_status "Setting up shared memory system..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    print_warning "Python3 not found. Memory system requires Python3"
    print_warning "Install Python3 and run: python3 scripts/init-memory-system.py"
else
    # Install mem0 if pip is available
    if command -v pip3 &> /dev/null; then
        print_status "Installing mem0..."
        pip3 install mem0 --quiet
        print_success "mem0 installed"
    else
        print_warning "pip3 not found. Install mem0 manually: pip3 install mem0"
    fi
    
    # Initialize memory system
    print_status "Initializing memory system..."
    python3 scripts/init-memory-system.py
    
    # Test memory integration
    print_status "Testing memory integration..."
    python3 scripts/agent-memory-integration.py
    
    print_success "Shared memory system configured"
fi

print_success "🎉 LCT Commit Agent System setup complete!"

echo ""
echo "📋 Next Steps:"
echo "1. Read the agent documentation: docs/agents/README.md"
echo "2. Set up environment variables in .env file"
echo "3. Test with a simple commit"
echo "4. Review team onboarding guide: docs/TEAM_ONBOARDING.md"
echo "5. Explore memory system: docs/agents/memory-system.md"
echo ""
echo "🤖 Available Agents:"
echo "- Primary Developer: Interactive coding assistant"
echo "- Sentinel: Automated code review"
echo "- Security Auditor: Weekly security scans"
echo "- Documentation Writer: On-demand docs"
echo ""
echo "🧠 Memory System:"
echo "- Shared memory across all agents"
echo "- Persistent context and learning"
echo "- Collaborative intelligence"
echo "- mem0-based memory management"
echo "- Cross-agent knowledge sharing"
echo ""
echo "🚀 Ready to transform healthcare in Kenya!"
