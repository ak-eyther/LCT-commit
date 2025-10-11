# Security Best Practices - LCT Healthcare Project

**Last Updated:** October 10, 2025
**Project:** LCT-Vitraya Healthcare Claims Partnership

---

## 🔐 Critical Security Rules

### ❌ NEVER Do This:
1. **NEVER hardcode API keys, tokens, or secrets in any file**
2. **NEVER commit credential files to Git**
3. **NEVER share credentials in chat, email, or documentation**
4. **NEVER store credentials in bash scripts or config files**
5. **NEVER use production credentials in test files**

### ✅ ALWAYS Do This:
1. **ALWAYS use GitHub Secrets** for sensitive data
2. **ALWAYS use environment variables** for local development
3. **ALWAYS add credential files to `.gitignore`**
4. **ALWAYS rotate keys** if they're accidentally exposed
5. **ALWAYS use placeholder values** in documentation

---

## 🛡️ How to Store Credentials Securely

### For GitHub Actions Workflows:
```yaml
# ✅ CORRECT - Use GitHub Secrets
env:
  LINEAR_API_KEY: ${{ secrets.LINEAR_API_KEY }}
  LINEAR_TEAM_ID: ${{ secrets.LINEAR_TEAM_ID }}

# ❌ WRONG - Hardcoded credentials
env:
  LINEAR_API_KEY: lin_api_abc123xyz...  # NEVER DO THIS!
```

### For Local Development:
```bash
# ✅ CORRECT - Use environment variables
export LINEAR_API_KEY="your-key-here"
export LINEAR_TEAM_ID="your-team-id"

# Store in .env file (already in .gitignore)
echo "LINEAR_API_KEY=your-key" > .env
echo "LINEAR_TEAM_ID=your-team" >> .env
source .env

# ❌ WRONG - Hardcode in scripts
API_KEY="lin_api_abc123..."  # NEVER DO THIS!
```

### For Documentation:
```markdown
# ✅ CORRECT - Use placeholders
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxx
LINEAR_API_KEY=your-key-here

# ❌ WRONG - Show real credentials
LINEAR_API_KEY=lin_api_abc123def456...  # NEVER show real keys in docs!
```

---

## 📋 Protected Credential Types

### 1. Linear API Keys
- **Pattern:** `lin_api_*`
- **Storage:** GitHub Secrets → `LINEAR_API_KEY`
- **Rotation:** Linear Settings → API → Regenerate Key

### 2. GitHub Tokens
- **Pattern:** `ghp_*` or `github_pat_*`
- **Storage:** Automatically provided as `${{ secrets.GITHUB_TOKEN }}`
- **Scope:** Read/Write for workflows only

### 3. Environment Variables
- **Protected:** `LINEAR_TEAM_ID`, `LINEAR_PROJECT_ID`
- **Storage:** GitHub Secrets or local `.env` file
- **Never commit:** `.env*` files are in `.gitignore`

---

## 🔍 What's Already Protected

### `.gitignore` Coverage:
```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Linear credentials and sensitive config
linear-credentials.sh
**/linear-credentials*.sh
LINEAR_INTEGRATION_CONFIG.md
get-linear-ids.sh
show-linear-ids.sh
test-linear-api.sh
test-linear-*.sh

# Test files with hardcoded credentials
/tmp/test_linear*.sh
/tmp/create_linear*.sh
```

### Sentinel Security Scanning:
- **Detects:** Hardcoded API keys, passwords, tokens
- **Blocks:** Commits with CRITICAL security issues
- **Reports:** Creates Linear issues for violations
- **Patterns:** `api_key`, `password`, `secret`, `token`, AWS keys, Stripe keys

---

## 🚨 What to Do If Credentials Are Exposed

### If Accidentally Committed to Git:
1. **Rotate the key immediately** (generate a new one)
2. **Remove from Git history** (use `git filter-branch` or BFG Repo-Cleaner)
3. **Update GitHub Secrets** with the new key
4. **Notify your team** of the key rotation

### If Exposed in Chat/Email:
1. **Rotate the key immediately**
2. **Update all systems** using the old key
3. **Verify no unauthorized access** occurred

### If Exposed in Documentation:
1. **Remove from documentation** (replace with placeholder)
2. **Check if it's the real key** or just an example
3. **Rotate if necessary**

---

## 📝 How to Set GitHub Secrets

### Via GitHub Web UI:
1. Go to: `https://github.com/ak-eyther/LCT-commit/settings/secrets/actions`
2. Click: **New repository secret**
3. Add:
   - `LINEAR_API_KEY` → Your Linear API key
   - `LINEAR_TEAM_ID` → Your Linear team UUID
   - `LINEAR_PROJECT_ID` → Your Linear project UUID (optional)

### Via GitHub CLI:
```bash
# Set secrets securely via command line
gh secret set LINEAR_API_KEY --body "your-new-key-here"
gh secret set LINEAR_TEAM_ID --body "your-team-uuid-here"

# Verify secrets are set (won't show values)
gh secret list
```

---

## ✅ Security Checklist

Before committing code:
- [ ] No hardcoded API keys or tokens
- [ ] All credentials use `${{ secrets.X }}` or environment variables
- [ ] `.gitignore` covers all sensitive files
- [ ] Test files use placeholder credentials only
- [ ] Documentation shows examples, not real values
- [ ] Sentinel pre-commit hook passed

Before pushing to GitHub:
- [ ] Review `git diff` for any secrets
- [ ] No credential files in `git status`
- [ ] GitHub Secrets are configured
- [ ] Team members know not to hardcode credentials

---

## 🎯 Healthcare-Specific Security

### PHI/PII Data Protection:
- **Never log patient data** in console or files
- **Encrypt sensitive data** at rest and in transit
- **Use secure API endpoints** (HTTPS only)
- **Validate all inputs** to prevent injection attacks

### Financial Data:
- **Invoice amounts** validated server-side only
- **Tariff data** from trusted sources only
- **Savings calculations** audited and logged
- **Payment credentials** never stored in code

---

## 📞 Questions?

**Security Issues:** Report immediately to Arif Khan (VP Africa)
**Credential Rotation:** Contact your team lead
**GitHub Secrets:** Follow this guide or ask DevOps

---

## 🔗 Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Sentinel Security Guide](./SENTINEL_README.md)
- [Linear API Security](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#authentication)

---

**Remember:** Security is everyone's responsibility. When in doubt, ask! 🛡️
