# Developer Onboarding Checklist

**Version:** 1.0.0
**Last Updated:** October 14, 2025
**Time to Complete:** 2-3 hours

---

## Welcome to LCT-Vitraya! 🎉

This checklist will help you get up to speed with our codebase, tools, and development practices.

---

## ✅ Phase 1: Environment Setup (30 min)

### 1.1 Get Access

- [ ] GitHub access to `ak-eyther/LCT-commit` repository
- [ ] Slack access to #lct-development channel
- [ ] Linear access for issue tracking
- [ ] Vercel access for deployments (if applicable)

### 1.2 Clone Repository

```bash
git clone https://github.com/ak-eyther/LCT-commit.git
cd LCT-commit
```

### 1.3 Install Dependencies

```bash
npm install
```

### 1.4 Environment Variables

- [ ] Copy `.env.example` to `.env`
- [ ] Get OpenAI API key from team lead
- [ ] Get database credentials (if applicable)
- [ ] Test configuration:

```bash
node -e "require('dotenv').config(); console.log('Config loaded:', process.env.OPENAI_API_KEY ? '✅' : '❌')"
```

---

## ✅ Phase 2: Understand the Project (45 min)

### 2.1 Read Core Documentation

- [ ] `README.md` - Project overview
- [ ] `CLAUDE.md` - Development guidelines and agent system
- [ ] `docs/BRANCHING_STRATEGY.md` - Git workflow
- [ ] `LCT_Vitraya_Complete_Project_Context.md` (if available) - Full business context

### 2.2 Understand the Business

**Key Points to Remember:**

- Healthcare claims adjudication for Kenya
- Goal: 90%+ accuracy to move from pilot to commercial
- Market: 1 Billion KES immediate, 4.5 Billion KES potential
- Critical success criteria: 31 evaluation points
- Data sensitivity: PHI/PII protection required

### 2.3 Review Success Criteria

- [ ] Open `lct-tracker-html.html` in browser
- [ ] Review all 31 criteria
- [ ] Note which ones are CRITICAL priority (4 items)

---

## ✅ Phase 3: Development Practices (45 min)

### 3.1 Error Handling Standards

- [ ] Read `docs/development/ERROR_HANDLING_GUIDE.md`
- [ ] Review example: `api/brain-dumps/process.js`
- [ ] Understand error infrastructure:
  - `src/lib/errors.js` - Error classes
  - `src/lib/error-handler.js` - Response utilities
  - `src/lib/config.js` - Config validation

**Key Principles:**

- ✅ Every error needs a tracking ID
- ✅ Use specific error types, not generic catches
- ✅ Validate input before expensive operations
- ✅ Never expose secrets in errors

### 3.2 Code Review with Sentinel

- [ ] Read `docs/SENTINEL_QUICK_START.md`
- [ ] Understand automated review process
- [ ] Review `.claude/checklists/error-handling-checklist.md`

**Sentinel automatically checks:**

- Security vulnerabilities (OWASP Top 10)
- Accessibility issues (WCAG 2.2)
- Error handling patterns
- Code quality

### 3.3 API Development

- [ ] Read `docs/features/brain-dumps/api-response-spec.md`
- [ ] Understand API contract testing
- [ ] Review `tests/integration/brain-dumps-api-contract.test.js`

**API Best Practices:**

- Document all request/response fields
- Include error IDs in all error responses
- Test all error scenarios
- Follow consistent response format

---

## ✅ Phase 4: Make Your First Commit (30 min)

### 4.1 Create Feature Branch

```bash
git checkout main
git pull
git checkout -b feature/your-feature-name
```

### 4.2 Make a Small Change

Try this exercise: Add your name to `docs/TEAM.md`

```markdown
## Team Members

- Your Name - Role - Start Date
```

### 4.3 Run Sentinel Review

```bash
git add docs/TEAM.md
git commit -m "docs: Add Your Name to team list"
```

Sentinel will automatically review your commit. If it passes:

```
✅ All critical security checks passed!
🎉 Commit approved - proceeding...
```

### 4.4 Push Your Branch

```bash
git push -u origin feature/your-feature-name
```

### 4.5 Create Pull Request

```bash
gh pr create --title "docs: Add Your Name to team" --body "Adding myself to the team list"
```

AI reviewers will automatically comment on your PR.

---

## ✅ Phase 5: Run Tests (20 min)

### 5.1 UI Tests (Athena Guard)

```bash
npm run test:ui:local
```

### 5.2 API Contract Tests

```bash
npx playwright test tests/integration/brain-dumps-api-contract.test.js
```

### 5.3 Understand Test Structure

- `tests/integration/` - API contract tests
- `tests/ui/` - UI and accessibility tests
- `tests/unit/` - Unit tests
- `tests/sentinel/` - Sentinel rule tests

---

## ✅ Phase 6: Learn the Tech Stack (ongoing)

### Frontend

- [ ] Vanilla JavaScript (no React for simple pages)
- [ ] Tailwind CSS for styling
- [ ] Terracotta design system (#d97757 primary color)
- [ ] Responsive design (mobile-first)

### Backend

- [ ] Vercel Serverless Functions
- [ ] Node.js/Express patterns
- [ ] PostgreSQL + Prisma ORM
- [ ] OpenAI API integration

### Tools & Services

- [ ] GitHub for version control
- [ ] Linear for issue tracking
- [ ] Vercel for hosting
- [ ] Sentry for error monitoring (upcoming)

---

## ✅ Quick Reference

### Common Commands

**Development:**

```bash
# Start local server (if applicable)
npm run dev

# Run UI tests
npm run test:ui:local

# Generate AI tests
npm run generate:tests
```

**Git Workflow:**

```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit changes (Sentinel reviews automatically)
git add .
git commit -m "feat: Add new feature"

# Push to remote
git push -u origin feature/my-feature

# Create PR
gh pr create --title "..." --body "..."
```

**Vercel Deployment:**

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Key Files to Know

**Configuration:**

- `.env` - Environment variables (never commit!)
- `.env.example` - Template for environment variables
- `vercel.json` - Vercel deployment config
- `package.json` - Dependencies and scripts

**Documentation:**

- `CLAUDE.md` - Project guidelines for AI and developers
- `docs/BRANCHING_STRATEGY.md` - Git workflow
- `docs/development/ERROR_HANDLING_GUIDE.md` - Error handling practices
- `docs/architecture/ERROR_HANDLING_ARCHITECTURE.md` - System design

**Code Structure:**

- `api/` - Vercel serverless functions
- `src/app/` - Frontend HTML pages
- `src/lib/` - Shared utilities
- `src/assets/` - Static assets
- `tests/` - All test files
- `.claude/` - AI agent definitions and checklists

---

## 🚨 Important Reminders

### Security

- ❌ Never commit API keys or secrets
- ❌ Never expose PHI/PII in logs or errors
- ❌ Never skip Sentinel checks (use `--no-verify` only in emergencies)
- ✅ Always validate user input
- ✅ Always include error IDs

### Code Quality

- ❌ Don't use generic try-catch blocks
- ❌ Don't create files without `Read`ing first
- ❌ Don't push directly to `main`
- ✅ Follow error handling patterns
- ✅ Write tests for new features
- ✅ Document API contracts

### Communication

- 📢 Ask questions in #lct-development
- 📢 Create Linear issues for bugs
- 📢 Update PR descriptions with context
- 📢 Tag reviewers when ready

---

## 🎯 Your First Week Goals

### Day 1

- [ ] Complete environment setup
- [ ] Read all core documentation
- [ ] Make first commit (add yourself to team)

### Day 2-3

- [ ] Review existing features (Brain Dumps, Success Matrix)
- [ ] Understand error handling patterns
- [ ] Run all tests locally

### Day 4-5

- [ ] Pick up first Linear issue (marked "good first issue")
- [ ] Implement fix/feature with proper error handling
- [ ] Create PR and address review comments

---

## 📚 Additional Resources

### Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Playwright Docs](https://playwright.dev)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Internal Docs

- `docs/FUNCTIONS_LIBRARY.md` - Utility functions
- `docs/MCP_SETUP.md` - MCP server setup
- `docs/agents/README.md` - AI agent system

### Getting Help

- **Slack:** #lct-development
- **GitHub Issues:** Tag with `question`
- **Team Lead:** Arif Khan (VP Africa)
- **Technical Lead:** Vidya Ratan

---

## ✅ Checklist Complete!

Once you've completed all items above, you're ready to contribute! 🎉

**Next Steps:**

1. Pick up first issue from Linear
2. Follow branching strategy
3. Write code with proper error handling
4. Create PR and get it reviewed
5. Celebrate your first merged PR! 🚀

**Welcome to the team!**

---

**Questions?** Ask in #lct-development or create a GitHub Discussion.
