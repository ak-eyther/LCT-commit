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
