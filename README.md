# LCT Success Matrix Tracker

> AI-powered healthcare claims processing system for Kenya - Quality tracking and monitoring dashboard

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ak-eyther/LCT-commit)

---

## 📋 Overview

The **LCT Success Matrix Tracker** is a comprehensive tool for tracking the implementation and progress of 31 evaluation criteria for healthcare claims adjudication in Kenya. This project is a collaboration between **LCT Group** (Kenya) and **Vitraya Technologies** (India).

### Key Features
- ✅ Track 31 evaluation criteria across 5 categories
- 📊 Real-time dashboard with progress visualization
- 🎯 Priority-based filtering (CRITICAL, High, Medium, Low)
- 💾 LocalStorage persistence (auto-save)
- 📤 Export to CSV and JSON
- 🎨 Clean, beginner-friendly UI
- 🚀 Zero build process - pure HTML/CSS/JavaScript

---

## 🎯 Project Goals

- **Primary Goal:** Achieve 90%+ adjudication accuracy by October 7, 2025
- **Market Opportunity:** 1 Billion KES immediately, 4.5 Billion KES potential
- **Impact:** Transform healthcare claims processing in Kenya

---

## 🗂️ Project Structure

```
LCT-Project/
├── index.html                         # Main tracker (Dashboard + Checklist) ⭐
├── reports.html                       # Reports & Analytics page
├── documentation.html                 # Project documentation viewer
├── settings.html                      # Settings & Data Management
├── lct-success-matrix-checklist.tsx   # React component version
├── LCT_Vitraya_Complete_Project_Context.md  # Full business context
├── claude.md                          # Claude AI assistant guide
├── agents.md                          # AI agent instructions
├── BRANCHING_STRATEGY.md              # Git workflow guide
├── vercel.json                        # Vercel deployment config
├── .gitignore                         # Git ignore rules
├── .vercelignore                      # Vercel deployment ignore
├── .coderabbit.yaml                   # Automated code review config
├── .github/
│   ├── workflows/
│   │   ├── code-review.yml            # Sentinel code review workflow
│   │   └── linear-integration.yml     # Linear issue creation workflow
│   └── PULL_REQUEST_TEMPLATE/
│       └── pull_request_template.md   # PR template
└── README.md                          # This file
```

### 📄 Multi-Page Application

The tracker is now a multi-page HTML application:

- **`index.html`** - Main dashboard with 31 criteria tracker
- **`reports.html`** - Analytics and progress reports
- **`documentation.html`** - Complete project documentation
- **`settings.html`** - Data import/export and management

All pages share data via `localStorage` - changes sync automatically!

---

## 🚀 Getting Started

### Option 1: Local Development (Recommended for Beginners)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd LCT-Project
   ```

2. **Open in browser**
   ```bash
   # Simply open the main HTML file
   open index.html
   # Or on Windows
   start index.html
   # Or on Linux
   xdg-open index.html
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

*For detailed explanations of each criterion, see the tracker dashboard.*

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

See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for complete workflow details.

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
localStorage.removeItem('lctTrackerData')
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

See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for detailed guidelines.

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

- **[claude.md](./claude.md)** - Claude AI assistant project guide
- **[agents.md](./agents.md)** - AI agent instructions and patterns
- **[BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md)** - Git workflow and best practices
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
- Review existing documentation in `claude.md` and `agents.md`
- Contact project maintainers

---

## 🚀 Next Steps

1. Open `lct-tracker-html.html` in browser
2. Review the 31 criteria
3. Focus on CRITICAL items first
4. Track your progress
5. Export regularly for backup

**Let's transform healthcare in Kenya! 🏥🇰🇪**
