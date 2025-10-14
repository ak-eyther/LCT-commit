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
