# LCT commit

> AI-powered healthcare claims processing system for Kenya
> Quality tracking and monitoring dashboard for 90% accuracy achievement

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ak-eyther/LCT-commit)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-5B4FFF)](https://claude.ai/claude-code)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Overview

**LCT commit** is a comprehensive tracking system for implementing and monitoring 31 evaluation criteria for healthcare claims adjudication in Kenya. This project represents a critical partnership between **LCT Group** (Kenya) and **Vitraya Technologies** (India) to transform healthcare claims processing with AI-powered accuracy.

### Key Features

- ✅ Track 31 evaluation criteria across 5 categories
- 📊 Real-time dashboard with progress visualization
- 🎯 Priority-based filtering (CRITICAL, High, Medium, Low)
- 💾 LocalStorage persistence (auto-save)
- 📤 Export to CSV and JSON
- 🎨 Clean, beginner-friendly UI
- 🚀 Zero build process - pure HTML/CSS/JavaScript
- 🔗 MCP Integration (Linear + Vercel) for enhanced automation

---

## 🎯 Project Goals

- **Primary Goal:** Achieve 90%+ adjudication accuracy by October 7, 2025
- **Market Opportunity:** 1 Billion KES immediately, 4.5 Billion KES potential
- **Impact:** Transform healthcare claims processing in Kenya

---

## 🗂️ Project Structure

```
LCT-commit/
├── 📄 Core Application Files
│   └── src/
│       └── app/
│           ├── index.html              # Main tracker dashboard ⭐
│           ├── reports.html            # Analytics & reports page
│           ├── documentation.html      # Documentation viewer
│           ├── settings.html           # Settings & data management
│           └── team-structure-v2.html  # Team organization chart
│
├── 📚 Documentation
│   ├── README.md                       # Project overview (this file)
│   ├── CLAUDE.md                       # Claude AI assistant guide
│   └── docs/
│       ├── README.md                   # Documentation index
│       ├── agents.md                   # AI agent instructions
│       ├── BRANCHING_STRATEGY.md       # Git workflow guide
│       ├── SECURITY_BEST_PRACTICES.md  # Security guidelines
│       ├── SENTINEL_README.md          # Sentinel code review docs
│       ├── SENTINEL_QUICK_START.md     # Sentinel quick guide
│       ├── SENTINEL_TESTING.md         # Sentinel testing guide
│       ├── TESTING_RESULTS.md          # Test results & metrics
│       ├── MCP_SETUP.md                # MCP server setup
│       ├── BUILDING_TOOLS.md           # Tool development guide
│       ├── FUNCTIONS_LIBRARY.md        # Function reference
│       ├── TEAM_ONBOARDING.md          # Team onboarding
│       └── agents/                     # Agent definitions
│           ├── README.md               # Agent registry
│           ├── primary-developer.md    # Developer agent
│           ├── code-reviewer-sentinel.md  # Sentinel agent
│           └── integrations.md         # Agent integrations
│
├── 🧪 Testing
│   └── tests/
│       ├── unit/                       # Unit tests
│       ├── integration/                # Integration tests
│       └── sentinel/                   # Security test cases
│
├── 🛠️ Scripts & Automation
│   ├── scripts/                        # Utility scripts
│   │   ├── agent-setup.sh              # Agent system setup
│   │   ├── memory_aware_agent.py       # AI memory integration
│   │   └── test-complete-system.py     # Full system tests
│   ├── setup-sentinel.sh               # Sentinel setup script
│   └── test-sentinel.sh                # Sentinel test runner
│
├── 🧠 Memory System
│   └── memory/                         # AI agent memory storage
│       ├── project/                    # Project-level memories
│       ├── development/                # Development memories
│       └── agents/                     # Agent-specific memories
│
├── ⚙️ Configuration
│   ├── vercel.json                     # Vercel deployment config
│   ├── .gitignore                      # Git ignore rules
│   ├── .coderabbit.yaml                # CodeRabbit config
│   ├── .claude/
│   │   ├── agents/                     # Claude agent definitions
│   │   ├── commands/                   # Slash commands
│   │   ├── hooks/                      # Event hooks
│   │   └── settings.local.json         # Local Claude settings
│   └── .env.mcp.example                # MCP environment template
│
├── 🤖 Automation & CI/CD
│   └── .github/
│       ├── workflows/
│       │   ├── code-review.yml         # Sentinel automated review
│       │   └── linear-integration.yml  # Linear issue creation
│       └── CODEOWNERS                  # Code ownership rules
│
└── 📦 Dependencies
    ├── package.json                    # npm packages
    └── node_modules/                   # Installed dependencies
```

### 📄 Multi-Page Application

The tracker is now a multi-page HTML application:

- **`src/app/index.html`** - Main dashboard with 31 criteria tracker
- **`src/app/reports.html`** - Analytics and progress reports
- **`src/app/documentation.html`** - Complete project documentation
- **`src/app/settings.html`** - Data import/export and management

All pages share data via `localStorage` - changes sync automatically!

---

## 🔗 MCP Integration

**LCT Commit** includes Model Context Protocol (MCP) server integration for enhanced automation:

### Available MCP Servers

- **Linear MCP**: Advanced issue tracking and project management
- **Vercel MCP**: Deployment automation and monitoring

### Quick Setup

1. **Install MCP servers**:

   ```bash
   npm install -g @modelcontextprotocol/server-linear
   npm install -g @modelcontextprotocol/server-vercel
   ```

2. **Configure environment**:

   ```bash
   cp env.example .env
   # Fill in your API keys
   ```

3. **Test connections**:
   ```bash
   npx @modelcontextprotocol/server-linear --test
   npx @modelcontextprotocol/server-vercel --test
   ```

### Features

- **Automated Linear Issues**: Create issues from Sentinel security findings
- **Deployment Tracking**: Monitor Vercel deployments and update Linear
- **Progress Reports**: Auto-generate weekly reports from 31 criteria status
- **Priority Mapping**: 🔴 CRITICAL → Priority 1, 🟠 HIGH → Priority 2

📖 **Full Setup Guide**: [docs/MCP_SETUP.md](./docs/MCP_SETUP.md)

---

## 🚀 Getting Started

### Option 1: Local Development (Recommended for Beginners)

1. **Clone the repository**

   ```bash
   git clone https://github.com/ak-eyther/LCT-commit.git
   cd LCT-commit
   ```

2. **Open in browser**

   ```bash
   # Simply open the main HTML file
   open src/app/index.html
   # Or on Windows
   start src/app/index.html
   # Or on Linux
   xdg-open src/app/index.html
   ```

3. **Start using!**
   - No build process needed
   - No dependencies to install
   - Works offline
   - Data saves automatically to browser localStorage

### Option 2: Deploy to Vercel

**Repository:** https://github.com/ak-eyther/LCT-commit
**Live URL:** https://lct-commit.vercel.app (auto-updates from Git)

#### Vercel Branching Strategy

Vercel follows your Git branching strategy:

```
main branch
  ↓
  Production: https://lct-commit.vercel.app

feature/* branches
  ↓
  Preview: https://lct-commit-git-feature-name.vercel.app
```

**Deployment Rules:**

- ✅ **Push to `main`** → Automatic production deployment
- ✅ **Push to `feature/*`** → Automatic preview deployment
- ✅ **Open PR** → Preview URL added to PR comments
- ⚡ **Deploy time:** ~30 seconds

#### Manual Deployment (if needed)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Deploy preview
vercel
```

---

## 📊 The 31 Success Criteria

### 1. Clinical Accuracy (3 items)

- ICD matches billed service
- Service-Diagnosis consistency with pre-auth
- Medical notes completeness

### 2. Financial & Policy Compliance (6 items)

- **[CRITICAL]** Invoice amount precedence
- Invoice date within policy period
- Preauthorization linkage accuracy
- Benefit-level savings tracking
- Service-level savings tracking
- **[CRITICAL]** Tariff and price validation

### 3. Fraud & Duplication Safeguards (18 items)

- Duplicate visit detection
- **[CRITICAL]** Repeated service detection
- Invoice number format consistency
- Remove non-alphanumeric characters
- Member visit frequency anomaly
- **[CRITICAL]** Cross-provider duplicate service
- Medication refill pattern analysis
- Provider billing pattern anomalies
- Benefit exhaustion velocity
- Family unit fraud pattern
- Geographic location mismatch
- Diagnosis-service historical validation
- High-cost service clustering
- Provider rejection rate trending
- Claim threshold manipulation
- Seasonal/temporal fraud patterns
- Chronic condition consistency
- Provider service scope validation

### 4. Vetting Completeness (2 items)

- 100% vetting completeness per visit
- Query criteria definition

### 5. Process Efficiency (2 items)

- Vetting TAT (<2 mins per claim)
- Cost savings by provider/scheme

_For detailed explanations of each criterion, see the tracker dashboard._

---

## 🛠️ Development Workflow

### Branching Strategy

We use a simplified Git Flow:

```
main (production)
  ↓
develop (staging)
  ↓
feature/*, fix/*, hotfix/* (short-lived)
```

### Creating a New Feature

```bash
# Start from main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/duplicate-detection

# Make changes, commit, and push
git add .
git commit -m "Add duplicate service detection

Implements criteria #11 (CRITICAL) - Repeated service detection.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push -u origin feature/duplicate-detection

# Merge via PR or directly to main
```

See [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) for complete workflow details.

---

## 📤 Using the Tracker

### Dashboard View

- View overall progress (% complete)
- See breakdown by priority level
- Monitor section-level completion
- Track critical items status

### Checklist View

- Filter by priority or status
- Expand criteria to see detailed explanations
- Update status and ownership
- Add notes on current coverage and future plans
- Auto-saves as you work

### Exporting Data

- **Save:** Auto-saves to browser localStorage
- **Export JSON:** Full data export for backup
- **Export CSV:** Spreadsheet-friendly format

---

## 🔧 Configuration

### Vercel Configuration

The `vercel.json` file configures:

- Static file serving
- Security headers (X-Frame-Options, CSP, etc.)
- Route rewrites
- Default index page

### LocalStorage Key

Data is saved to: `lctTrackerData`

To clear data:

```javascript
localStorage.removeItem('lctTrackerData');
```

---

## 🤝 Contributing

### Quick Contribution Guide

1. **Pick a task**
   - Focus on CRITICAL priority items first
   - Check existing issues/PRs to avoid duplication

2. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**
   - Keep code simple and well-commented
   - Follow beginner-friendly style
   - Test thoroughly

4. **Submit PR**
   - Use the PR template
   - Link to related criteria
   - Include test results

5. **Code Review**
   - 🤖 **Automatic reviews** by Coderabbit AI on every push
   - Reviews check: code quality, security, performance, best practices
   - Address reviewer feedback
   - Update as needed
   - Celebrate when merged! 🎉

See [docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md) for detailed guidelines.

### 🤖 Multi-Agent Automated Code Reviews

Every commit and PR automatically triggers **three elite AI review agents**:

**🐰 CodeRabbit - Primary Code Reviewer**

- Comprehensive code analysis & best practices
- Performance optimization suggestions
- Documentation & maintainability reviews
- Refactoring recommendations

**💻 Codex - AI Code Analysis Agent**

- Deep code understanding & pattern recognition
- Algorithm efficiency analysis
- Context-aware suggestions
- Code structure optimization

**🛡️ Sentinel - Senior Security & QA Agent**

- Security scanning (OWASP Top 10 2025)
  - Hardcoded secrets detection
  - SQL injection & XSS vulnerability scanning
  - Authentication/SSL verification
- UI/UX accessibility (WCAG 2.2)
  - Missing alt text, labels
  - Keyboard navigation checks
- Functional quality checks
  - Error handling validation
  - Code quality issues (console.log, TODOs)
- Posts comments with priority markers (🔴🟠🟡🟢)
- **Blocks merge** when CRITICAL security issues detected

**📊 Linear Integration - Issue Tracking**

- Automatically creates Linear issues from AI reviewer comments
- Works with Sentinel, CodeRabbit, and any AI reviewer
- Maps priorities: 🔴 CRITICAL → Priority 1, 🟠 HIGH → Priority 2, etc.
- **Team:** Vitraya-ak (configured)
- **Workflow:** `.github/workflows/linear-integration.yml`

All three agents work together to ensure code quality, security, and accessibility!
Reviews appear as comments on commits and PRs automatically.

---

## 📚 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Claude AI assistant project guide
- **[docs/agents.md](./docs/agents.md)** - AI agent instructions and patterns
- **[docs/BRANCHING_STRATEGY.md](./docs/BRANCHING_STRATEGY.md)** - Git workflow and best practices
- **[LCT_Vitraya_Complete_Project_Context.md](./LCT_Vitraya_Complete_Project_Context.md)** - Full business context

---

## 🎯 Priority Levels

### CRITICAL (4 items)

Must work perfectly to achieve 90% accuracy goal:

- Invoice amount precedence
- Tariff validation
- Repeated service detection
- Cross-provider duplicate service

### High (17 items)

Very important for quality metrics and fraud detection

### Medium (8 items)

Nice to have, improves overall system quality

### Low (2 items)

Future enhancements

---

## 🚨 Troubleshooting

### Data Not Saving

- Check browser localStorage is enabled
- Try exporting to JSON as backup
- Clear browser cache and reload

### Vercel Deployment Issues

- Verify `vercel.json` is in root directory
- Check Vercel build logs for errors
- Ensure `main` and `develop` branches exist

### Browser Compatibility

- Tested on: Chrome, Firefox, Safari, Edge
- Requires modern browser with localStorage support
- JavaScript must be enabled

---

## 📊 Current Status

Track real-time progress by opening the tracker dashboard!

**Last Updated:** October 7, 2025

---

## 🔐 Security

- No sensitive patient data in code
- All examples use fake/anonymized data
- Security headers configured in Vercel
- No external API calls (fully client-side)

---

## 📝 License

[Add your license here]

---

## 👥 Team

**LCT Group (Kenya)**

- Healthcare claims management experts
- Domain knowledge and validation

**Vitraya Technologies (India)**

- AI/ML engineering
- Software development

---

## 🙏 Acknowledgments

- LCT Group for the comprehensive evaluation framework
- Vitraya Technologies for AI innovation
- All contributors to this project

---

## 📞 Support

For questions or issues:

- Create an issue in this repository
- Review existing documentation in `CLAUDE.md` and `docs/agents.md`
- Contact project maintainers

---

## 🚀 Next Steps

1. **Open the tracker**: `open src/app/index.html` in your browser
2. **Review the 31 criteria**: Understand what needs to be implemented
3. **Focus on CRITICAL items first**: 4 must-have features
4. **Track your progress**: Update status as you implement
5. **Export regularly**: Backup your data to JSON/CSV

---

## 📈 Project Metrics

- **31 Criteria** across 5 categories
- **4 CRITICAL** priority items
- **17 HIGH** priority items
- **Goal**: 90% adjudication accuracy by October 7, 2025
- **Market**: 1B KES immediate, 4.5B KES potential

---

## 🔗 Quick Links

- **Live Demo**: [lct-commit.vercel.app](https://lct-commit.vercel.app)
- **Repository**: [github.com/ak-eyther/LCT-commit](https://github.com/ak-eyther/LCT-commit)
- **Documentation**: [docs/README.md](./docs/README.md)
- **Contributor Guide**: [AGENTS.md](./AGENTS.md)
- **Team Onboarding**: [docs/TEAM_ONBOARDING.md](./docs/TEAM_ONBOARDING.md)

---

**Let's transform healthcare in Kenya! 🏥🇰🇪**

---

_Last Updated: October 11, 2025_
_Version: 1.0.0_
_Built with Claude Code_
