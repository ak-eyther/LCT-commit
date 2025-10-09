# Claude Assistant Guide for LCT-Vitraya Project

**Last Updated:** October 7, 2025
**Project:** LCT Group & Vitraya Technologies Healthcare Claims Partnership

---

## 🎯 Project Overview in 30 Seconds

**What:** AI-powered healthcare claims processing system for Kenya
**Who:** LCT Group (Kenya) + Vitraya Technologies (India)
**Goal:** Achieve 90%+ accuracy to move from pilot to commercial phase
**Stakes:** 1 Billion KES currently, potential 4.5 Billion KES market
**Status:** Critical transition phase - quality achievement is TOP priority

---

## 📋 Key Context You Need to Know

### Current Situation
- **Stage:** Pilot phase (not yet commercial/billing)
- **Blocker:** LCT wants proven 90%+ adjudication quality
- **Volume:** ~850 claims/week, 19.8% average savings
- **Main Scheme:** MTRH (Medical Training & Referral Hospital)
- **Next Deadline:** October 7, 2025 - 90% quality target

### The Business Model
1. **Now:** LCT pays hospitals in 60 days
2. **Future:** FinTech model pays in 24 hours
3. **Money:** Providers give 10-15% discount for fast payment
4. **Scale:** 11 schemes worth 1 Billion KES/year ready to go

### Critical Success Criteria
```
▪ 31 evaluation criteria across 5 categories
▪ 4 marked as CRITICAL priority
▪ 17 marked as High priority
▪ Focus: Clinical accuracy + Fraud detection
```

---

## 🗂️ Project Files Reference

### Core Documentation
- **`LCT_Vitraya_Complete_Project_Context.md`**
  - Full business context, market analysis, team structure
  - Read this first for complete understanding
  - 150+ pages of consolidated meeting notes

### Implementation Trackers
- **`lct-success-matrix-checklist.tsx`**
  - React component with 17 basic criteria
  - Interactive status tracking
  - Good for quick overview

- **`lct-tracker-html.html`**
  - Complete standalone tracker with 31 criteria
  - Dashboard with statistics
  - Saves data to localStorage
  - Export to CSV/JSON
  - **USE THIS ONE for serious work**

### Code Quality & Security
- **🛡️ Sentinel - Automated Code Review Agent**
  - Elite AI code reviewer (OWASP Top 10 + WCAG 2.2)
  - Runs on every commit and PR
  - Blocks security vulnerabilities automatically
  - Posts GitHub comments with priority markers (🔴🟠🟡🟢)
  - **Quick Start**: `SENTINEL_QUICK_START.md`
  - **Full Guide**: `SENTINEL_README.md`
  - **Agent Definition**: `.claude/agents/code-reviewer.md`
  - **Setup**: `./setup-sentinel.sh`

- **📊 Linear Integration - Issue Tracking**
  - Automatically creates Linear issues from AI reviewer comments
  - Works with Sentinel, CodeRabbit, and any AI reviewer
  - Maps priorities: 🔴 CRITICAL → Priority 1, 🟠 HIGH → Priority 2, etc.
  - **Team**: Vitraya-ak (ID: b5835b14-c3cd-4048-b42a-7a7502647f4b)
  - **Workflow**: `.github/workflows/linear-integration.yml`
  - **Setup**: GitHub Secrets (LINEAR_API_KEY, LINEAR_TEAM_ID)

---

## 💡 How to Help with This Project

### When Asked About Status
1. Reference the HTML tracker (31 items)
2. Focus on CRITICAL priority items first (4 items)
3. Check completion percentage from dashboard
4. Identify blockers

### When Asked to Build/Modify Features
1. **Always ask:** "Is this related to one of the 31 criteria?"
2. **Priority order:**
   - CRITICAL items → High items → Medium → Low
3. **Keep it simple:** This is for beginners
4. **Test locally first:** Use HTML file, not complex builds

### When Asked About Technical Implementation
**Current Stack:**
- Frontend: React + Tailwind CSS
- Backend: Node.js/Next.js
- Database: PostgreSQL + Prisma ORM
- AI Engine: Vitraya proprietary (black box to us)
- Hosting: Cloud infrastructure

**Key Technical Challenges:**
- Invoice digitization accuracy
- Savings calculation methodology
- Provider document upload compliance
- API performance and reliability

---

## 🔍 Common Questions & Answers

### "What's the most important thing right now?"
**Answer:** Achieving 90% adjudication accuracy by October 7, 2025. Everything else is secondary.

### "Which criteria are CRITICAL?"
**Answer:** 4 items:
1. Invoice amount precedence (LCT → ETIMS → Document)
2. Tariff and price validation
3. Repeated service detection
4. Cross-provider duplicate service detection

### "What's the FinTech opportunity?"
**Answer:**
- Providers currently wait 60 days for payment
- New model: Pay in 24 hours
- Providers discount 10-15% for fast payment
- LCT still pays in 60 days = arbitrage opportunity
- Needs 250M KES working capital

### "Why are they still in pilot?"
**Answer:**
- Quality concerns from LCT
- Need consistent 90%+ accuracy proven
- Until then = no commercial billing = no revenue
- October 2025 is make-or-break month

### "What's the addressable market?"
**Immediate:** 1B KES (11 LCT-controlled schemes)
**Medium-term:** 1.5B KES (Liaison Group partnership)
**Long-term:** 4.5B KES (corporate self-funded schemes)
**Massive:** Entire Kenya insurance industry transformation

---

## 🎯 Key Success Metrics (Remember These)

### Quality Metrics
- **Target:** 90%+ adjudication accuracy
- **Current:** Improving but not commercial-ready
- **Measurement:** Correct approve/reject vs manual review

### Financial Performance
- **Savings:** 19.8% average across schemes
- **Volume:** 847 claims/week (trending up)
- **Top Scheme:** MTRH at 19.8% savings

### Fraud Detection
- **Example Case:** CB-109764-25
  - Provider billed: 1,700 KES
  - Documents showed: 3,370 KES
  - AI detected: 98.2% variance
  - Decision: Rejected (billing anomaly)

---

## 🚨 Red Flags to Watch For

### Business Red Flags
- Any discussion of billing before 90% quality achieved
- Pressure to scale before proving MTRH success
- Skipping documentation requirements
- Provider resistance to document uploads

### Technical Red Flags
- Hardcoded values instead of tariff validation
- Missing fraud detection patterns
- Incomplete vetting per invoice
- No savings tracking by service type

### User Experience Red Flags
- Complex interfaces for non-technical users
- Requiring manual data entry that could be automated
- No export/backup functionality
- Missing status tracking

---

## 🔧 Development Guidelines

### For Beginners (Small Steps Approach)
1. **Start with HTML file** - No build process needed
2. **One feature at a time** - Don't try to do everything
3. **Test in browser** - Open HTML, make change, refresh
4. **Save often** - LocalStorage is your friend
5. **Export regularly** - CSV backup of your progress
6. **Let Sentinel review** - Commit often to get automated feedback

### Code Style
- **Keep it readable** - Comments for complex logic
- **Use simple names** - `status` not `sts`, `criteria` not `crit`
- **Avoid nested loops** - Flatten when possible
- **One responsibility** - Each function does ONE thing
- **Security first** - Never hardcode secrets, validate all inputs

### Testing Approach
```javascript
// Good: Test one criteria at a time
function testInvoiceValidation() {
  const result = validateInvoice(testData);
  console.log('Invoice validation:', result);
}

// Bad: Test everything at once
function testEverything() {
  // 500 lines of test code
}
```

### 🛡️ Working with Sentinel Code Review

**Sentinel automatically reviews your code for:**
- Security vulnerabilities (hardcoded secrets, SQL injection, XSS)
- Accessibility issues (missing alt text, labels)
- Code quality problems (console.logs, missing error handling)

**When committing code:**
```bash
# Sentinel runs automatically
git add .
git commit -m "Implement criteria #4: Invoice validation"

# If Sentinel blocks with CRITICAL issues:
# 1. Read the error message carefully
# 2. Fix the security issue
# 3. Commit again

# Only bypass in emergencies (rarely!)
git commit --no-verify -m "Emergency fix"
```

**Understanding Sentinel feedback:**
- 🔴 **CRITICAL**: Security risk - must fix before merging
- 🟠 **HIGH**: Major issue - fix before release
- 🟡 **MEDIUM**: Code quality - address in next sprint
- 🟢 **LOW**: Nice-to-have - backlog item

**LCT-Specific Security Rules Sentinel Enforces:**
1. No hardcoded API keys or passwords
2. Patient data (PHI) must be encrypted
3. Financial calculations validated server-side only
4. All user inputs sanitized before use
5. Error messages don't expose sensitive data
6. Proper error handling on all async operations

**Example - Sentinel-approved code:**
```javascript
// ✅ GOOD - Sentinel approves this
async function processInvoice(invoiceData) {
  try {
    // Validate inputs (prevents injection)
    if (!invoiceData || typeof invoiceData.amount !== 'number') {
      throw new Error('Invalid invoice data');
    }

    // Server-side validation only (Criteria #4)
    const validated = await validateWithLCTSystem(invoiceData);

    return { success: true, result: validated };
  } catch (error) {
    // Safe error handling (no data exposure)
    console.error('Invoice processing failed');
    return { success: false, error: 'Processing failed' };
  }
}

// ❌ BAD - Sentinel will block this
const API_KEY = "sk_live_abc123"; // Hardcoded secret!
function processInvoice(data) {
  // No validation!
  return fetch(`/api?data=${data}`); // No error handling!
}
```

---

## 📞 Key People (Reference Only)

### Vitraya Leadership
- **Arif Khan** - VP Africa (main decision maker)
- **Vidya Ratan** - Sr Technical Lead (engineering)
- **Vinita Saini** - GM Africa (business)

### LCT Leadership
- **Irene** - Created the 31-criteria evaluation matrix
- (LCT contacts in main document)

---

## 🎓 Learning Resources

### Understanding Healthcare Claims
- Read Section 3 "Fraud & Duplication Safeguards" in context doc
- Study the example case (CB-109764-25)
- Review the 31 criteria explanations in HTML tracker

### Understanding the Business
- Review Section "Market Segments & Revenue Opportunities"
- Study the FinTech model explanation
- Read "Current Challenges & Status"

### Understanding the Code
- Start with lct-tracker-html.html (standalone, simple)
- Progress to React component when comfortable
- Reference technical stack in context document

---

## ✅ Quick Checklist for Any Task

Before starting work:
- [ ] Have I read the relevant section in context doc?
- [ ] Do I understand which criteria this relates to?
- [ ] Is this CRITICAL, High, Medium, or Low priority?
- [ ] Can I test this locally without complex setup?
- [ ] Have I asked clarifying questions?

Before finishing work:
- [ ] Does it work for beginners?
- [ ] Is it well-commented?
- [ ] Can results be saved/exported?
- [ ] Does it solve the actual problem?
- [ ] Have I tested edge cases?

---

## 🎯 Remember This Above All

**The Goal:** Help LCT and Vitraya achieve 90% accuracy by October 7, 2025

**The Why:** Unlock 1 Billion KES market immediately, 4.5 Billion KES long-term

**The How:** Track, implement, and validate all 31 success criteria

**The Approach:** Small steps, test often, beginner-friendly

---

## 📝 Notes Section (For Future Sessions)

When returning to this project:
1. Check date - is October 7, 2025 deadline passed?
2. Load HTML tracker - what's the completion %?
3. Review CRITICAL items - are all 4 complete?
4. Ask user for latest status update
5. Prioritize work based on current blockers

---

**Need help? Start with:**
1. Open `lct-tracker-html.html` in browser
2. Review the 31 criteria
3. Focus on CRITICAL items first
4. Ask specific questions about what to build

**This project will transform healthcare in Kenya. Let's get it done. 🚀**
