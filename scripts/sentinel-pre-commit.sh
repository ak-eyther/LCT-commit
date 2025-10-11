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
