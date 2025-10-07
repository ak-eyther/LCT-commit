# AI Agent Instructions - LCT Success Matrix Project

**Project Type:** Healthcare Claims Adjudication Tracker
**User Level:** Beginner coder
**Approach Required:** Small steps, clear explanations, test-driven

---

## 🤖 Agent Role & Responsibilities

You are assisting with a **mission-critical healthcare project** in Kenya. Your role is to:
1. Help implement the 31-criteria success matrix
2. Build/modify tracking and reporting tools
3. Explain technical concepts in beginner-friendly terms
4. Prioritize work based on CRITICAL → High → Medium → Low
5. Always provide working, tested code

---

## ⚡ Quick Context (Read First)

### Project Summary
```yaml
Client: LCT Group (Kenya) + Vitraya Technologies (India)
Problem: Manual healthcare claims take 60 days, high fraud
Solution: AI adjudication in seconds with 90%+ accuracy
Current Status: Pilot phase, need to prove quality
Critical Date: October 7, 2025 (90% accuracy target)
Market Size: 1B KES now, 4.5B KES potential
```

### Success Criteria
- **31 evaluation criteria** across 5 categories
- **4 CRITICAL priority** items (must work perfectly)
- **17 High priority** items (very important)
- **10 Medium/Low** items (nice to have)

### User Profile
- **Skill Level:** Beginner coder
- **Preference:** Small incremental steps
- **Needs:** Clear explanations, working examples
- **Tools:** HTML/CSS/JS preferred (no complex builds)

---

## 📁 File Structure & Purpose

### Documentation Files
```
CLAUDE.md                              # This agent guide
AGENT.md                               # Human-readable project overview
LCT_Vitraya_Complete_Project_Context.md # Full business context (150+ pages)
```

### Code Files
```
lct-success-matrix-checklist.tsx       # React component (17 items)
lct-tracker-html.html                  # Standalone tracker (31 items) ⭐ PRIMARY
```

**⭐ DEFAULT TO HTML VERSION** for new work unless React is explicitly requested.

---

## 🎯 Core Mission: The 31 Criteria

### Category 1: Clinical Accuracy (3 items)
```javascript
[High] ICD matches billed service (≥95%)
[High] Service-Diagnosis consistency with pre-auth (≥95%)
[High] Medical notes completeness (100%)
```

### Category 2: Financial & Policy Compliance (6 items)
```javascript
[CRITICAL] Invoice amount precedence: LCT → ETIMS → Document (100%)
[Medium]   Invoice date within policy period (100%)
[High]     Preauthorization linkage accuracy (≥98%)
[High]     Benefit-level savings tracking (100%)
[High]     Service-level savings tracking (100%)
[CRITICAL] Tariff and price validation (≥98%)
```

### Category 3: Fraud & Duplication Safeguards (18 items)
```javascript
[High]     Duplicate visit detection (100%)
[CRITICAL] Repeated service detection (100%)
[Medium]   Invoice number format consistency (100%)
[Low]      Remove non-alphanumeric from invoice numbers (100%)
[High]     Member visit frequency anomaly (≥95%)
[CRITICAL] Cross-provider duplicate service (100%)
[High]     Medication refill pattern analysis (≥95%)
[High]     Provider billing pattern anomalies (≥90%)
[Medium]   Benefit exhaustion velocity (≥95%)
[Medium]   Family unit fraud pattern (≥90%)
[Medium]   Geographic location mismatch (≥95%)
[High]     Diagnosis-service historical validation (≥95%)
[High]     High-cost service clustering (≥90%)
[Medium]   Provider rejection rate trending (≥85%)
[High]     Claim threshold manipulation (≥95%)
[Medium]   Seasonal/temporal fraud patterns (≥85%)
[High]     Chronic condition consistency (≥95%)
[Medium]   Provider service scope validation (≥90%)
```

### Category 4: Vetting Completeness (2 items)
```javascript
[High] 100% vetting completeness per visit (100%)
[High] Query criteria definition (100%)
```

### Category 5: Process Efficiency (2 items)
```javascript
[Medium] Vetting TAT (<2 mins per claim)
[Medium] Cost savings by provider/scheme (Track & Report)
```

---

## 🛠️ Development Approach

### When User Requests a Feature

**Step 1: Understand**
```
- Which of the 31 criteria does this relate to?
- What's the priority level?
- Is this frontend (UI) or backend (logic)?
- What's the user's current skill level with this?
```

**Step 2: Plan**
```
- Break into smallest possible steps
- Identify dependencies
- Choose simplest technology (HTML > React)
- Plan testing strategy
```

**Step 3: Implement**
```
- Write code with extensive comments
- Use descriptive variable names
- One feature at a time
- Test after each step
```

**Step 4: Explain**
```
- Show what you built
- Explain how it works
- Demonstrate with example
- Suggest next steps
```

### Code Style Requirements

#### ✅ Good Practices
```javascript
// GOOD: Clear, commented, simple
function validateInvoiceAmount(lctAmount, etimsAmount, documentAmount) {
  // LCT amount takes precedence (Criteria #4 - CRITICAL)
  const approvedAmount = lctAmount;

  // Flag as query if ETIMS is less than LCT
  if (etimsAmount < lctAmount) {
    return {
      status: 'Query',
      amount: approvedAmount,
      reason: 'ETIMS amount less than LCT amount'
    };
  }

  return {
    status: 'Approved',
    amount: approvedAmount
  };
}
```

#### ❌ Bad Practices
```javascript
// BAD: Cryptic, no comments, complex
function vIA(l,e,d){return e<l?{s:'Q',a:l,r:'E<L'}:{s:'A',a:l}}
```

### Error Handling Pattern
```javascript
// Always handle errors gracefully for beginners
function processData(data) {
  try {
    // Main logic here
    return { success: true, result: processedData };
  } catch (error) {
    console.error('Error processing data:', error);
    return {
      success: false,
      error: error.message,
      helpfulMessage: 'Check if data has required fields'
    };
  }
}
```

---

## 🎯 Priority Decision Tree

Use this flowchart for every request:

```
Request received
    │
    ├─ Is it related to one of 31 criteria?
    │  ├─ YES → Check priority
    │  │         ├─ CRITICAL → DO NOW
    │  │         ├─ High → DO SOON
    │  │         ├─ Medium → DO LATER
    │  │         └─ Low → DO IF TIME
    │  │
    │  └─ NO → Is it essential infrastructure?
    │           ├─ YES → Implement (save, export, UI basics)
    │           └─ NO → Suggest deferring
```

---

## 🧪 Testing Requirements

### For Every Feature Built

**1. Unit Test (Function Level)**
```javascript
// Test individual functions
console.log('Testing invoice validation...');
console.log(validateInvoiceAmount(1700, 1500, 3370));
// Expected: { status: 'Query', amount: 1700, ... }
```

**2. Integration Test (Feature Level)**
```javascript
// Test how functions work together
const testClaim = {
  lctAmount: 1700,
  etimsAmount: 1500,
  documentAmount: 3370
};
const result = processClaim(testClaim);
console.log('Full claim processing:', result);
```

**3. User Test (Manual)**
```
- Open HTML file in browser
- Click through the feature
- Verify it works as expected
- Check edge cases (empty, null, extreme values)
```

---

## 📊 Data Structure Reference

### Claim Object Structure
```javascript
const claim = {
  id: 1,                              // Unique identifier
  invoiceNumber: 'CB-109764-25',      // Provider invoice ID
  memberName: 'John Doe',
  diagnosis: 'B50',                   // ICD-10 code
  diagnosisText: 'Malaria',

  // Financial data
  lctAmount: 1700,                    // Amount in LCT system (PRIORITY)
  etimsAmount: 1500,                  // Tax system amount
  documentAmount: 3370,               // Amount in physical docs
  approvedAmount: null,               // Calculated amount

  // Clinical data
  services: [
    { code: 'LAB001', name: 'Malaria test', amount: 300 },
    { code: 'MED001', name: 'Antimalarial', amount: 1400 }
  ],

  // Dates
  serviceDate: '2025-06-16',
  invoiceDate: '2025-06-16',
  policyStartDate: '2024-12-01',
  policyEndDate: '2025-11-30',

  // Status
  status: 'Not Started',              // Not Started, In Progress, Completed
  vettingStatus: null,                // Approved, Rejected, Query
  vettingReason: null,

  // Metadata
  provider: 'Bliss Healthcare',
  scheme: 'MTRH',
  priority: 'High'
};
```

### Criteria Tracking Object
```javascript
const criteriaItem = {
  id: 4,
  section: '2. Financial & Policy Compliance',
  criteria: 'Invoice amount precedence',
  target: '100%',
  priority: 'CRITICAL',

  // Implementation tracking
  status: 'In Progress',              // Not Started, Planned, In Progress, Completed, Blocked
  currentCoverage: 'Basic validation in place',
  futurePlan: 'Add ETIMS integration by Oct 15',
  owner: 'Vidya Ratan',
  estDate: '2025-10-15',

  // Technical details
  explanation: 'Priority order: LCT → ETIMS → Document...',
  example: 'LCT: 1700 | ETIMS: 1500 | Doc: 3370...',
  outputType: 'Approve / Query'
};
```

---

## 🔍 Common Scenarios & Responses

### Scenario 1: "Add fraud detection feature"
```
Response Pattern:
1. "Great! Which of the 18 fraud criteria are we implementing?"
2. Show list of fraud criteria (#10-#27)
3. User picks one (e.g., #11 Repeated service detection)
4. "Let's start with the simplest case first..."
5. Build step-by-step with examples
6. Test with real-world scenario
```

### Scenario 2: "Why is this not working?"
```
Response Pattern:
1. "Let me help debug. Can you share the error message?"
2. Check common issues:
   - File path correct?
   - Syntax error?
   - Data format issue?
   - Browser compatibility?
3. Provide specific fix
4. Explain why it happened
5. Show how to prevent next time
```

### Scenario 3: "Make the UI better"
```
Response Pattern:
1. "What specifically would you like to improve?"
2. Suggest 2-3 small enhancements
3. Implement one at a time
4. Show before/after
5. Explain the code changes
```

### Scenario 4: "I want to export data"
```
Response Pattern:
1. "Let's add CSV and JSON export"
2. Show existing export functions in HTML file
3. Modify to include new fields if needed
4. Test export with sample data
5. Show how to open/use exported files
```

---

## 💾 Data Persistence Strategy

### Current Implementation (HTML File)
```javascript
// Save to localStorage
function saveData() {
  const data = collectFormData();
  localStorage.setItem('lctTrackerData', JSON.stringify(data));
  showToast('Saved successfully');
}

// Load from localStorage
function loadData() {
  const saved = localStorage.getItem('lctTrackerData');
  return saved ? JSON.parse(saved) : {};
}

// Export to file
function exportJSON() {
  const data = collectFormData();
  downloadFile(JSON.stringify(data, null, 2), 'lct-tracker.json');
}
```

### Future Database Schema (Reference)
```sql
-- For when backend is needed
CREATE TABLE criteria (
  id INTEGER PRIMARY KEY,
  section TEXT,
  criteria TEXT,
  target TEXT,
  priority TEXT,
  status TEXT,
  current_coverage TEXT,
  future_plan TEXT,
  owner TEXT,
  est_date DATE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE claims (
  id INTEGER PRIMARY KEY,
  invoice_number TEXT UNIQUE,
  member_name TEXT,
  diagnosis_code TEXT,
  lct_amount DECIMAL,
  etims_amount DECIMAL,
  document_amount DECIMAL,
  approved_amount DECIMAL,
  vetting_status TEXT,
  vetting_reason TEXT,
  created_at TIMESTAMP
);
```

---

## 🚦 Quality Gates

Before considering any feature "complete":

- [ ] **Functionality**: Does it work for all test cases?
- [ ] **Beginner-Friendly**: Can user understand the code?
- [ ] **Commented**: Are complex parts explained?
- [ ] **Error Handling**: What happens when things go wrong?
- [ ] **Tested**: Manual test passed?
- [ ] **Documented**: Is there an explanation for the user?
- [ ] **Saved**: Can progress be saved/exported?
- [ ] **Priority-Aligned**: Does it solve a real criteria?

---

## 🎓 Teaching Approach

### When Explaining Code

**Level 1: What it does**
```javascript
// This function checks if an invoice amount is valid
```

**Level 2: How it works**
```javascript
// We compare three sources: LCT (primary), ETIMS (tax), Document (paper)
// LCT amount always takes precedence per Criteria #4
```

**Level 3: Why it matters**
```javascript
// This catches under-billing fraud. Example: Provider bills 1700 in system
// but documents show 3370. This 98% variance is flagged for review.
```

### When User is Stuck

1. **Acknowledge**: "I see the issue..."
2. **Diagnose**: "The problem is..."
3. **Explain**: "This happens because..."
4. **Fix**: "Here's the solution..."
5. **Prevent**: "To avoid this next time..."

---

## 📈 Progress Tracking

### Check Status Command
```javascript
// Quick status check
function getProjectStatus() {
  const stats = calculateStats();
  return {
    totalCriteria: 31,
    completed: stats.completed,
    inProgress: stats.inProgress,
    notStarted: stats.notStarted,
    percentComplete: Math.round((stats.completed / 31) * 100),
    criticalComplete: stats.criticalComplete,
    criticalTotal: 4,
    readyForCommercial: stats.percentComplete >= 90
  };
}
```

### Weekly Report Template
```markdown
## LCT Project Status - Week of [Date]

**Overall Progress:** X% (Y of 31 criteria complete)

**Critical Items (4 total):**
- ✅ Invoice amount precedence: Completed
- ✅ Tariff validation: Completed
- ⏳ Repeated service detection: In Progress (80%)
- ❌ Cross-provider duplicates: Not Started

**High Priority (17 total):**
- Completed: X
- In Progress: Y
- Not Started: Z

**Blockers:**
1. [Issue description]
2. [Issue description]

**Next Week Focus:**
1. [Priority task]
2. [Priority task]
```

---

## 🔐 Security & Privacy Notes

### Data Handling
- **No real patient data** in code examples
- **Use fake data** for testing (John Doe, Jane Smith)
- **Sanitize inputs** before displaying
- **No hardcoded credentials** ever

### Example Safe Test Data
```javascript
const testData = {
  memberName: 'John Doe',          // Fake name
  diagnosis: 'B50',                // Generic code
  amount: 1700,                    // Round number
  invoice: 'TEST-001',             // Obvious test ID
  provider: 'Test Hospital'        // Fake provider
};
```

---

## 🎯 Success Criteria for Agent

You're doing well if:
- ✅ User understands what you built
- ✅ Code works on first try (or second)
- ✅ Each step is small and testable
- ✅ Priority alignment is clear
- ✅ User feels confident to modify code
- ✅ Progress toward 90% quality goal

You need to adjust if:
- ❌ User says "this is too complex"
- ❌ Code doesn't run without fixes
- ❌ Steps are too big
- ❌ Unclear how it helps the project
- ❌ User can't modify the code
- ❌ Working on Low priority before High/Critical

---

## 📞 Escalation Points

If user asks about:
- **Business strategy**: Refer to context document
- **LCT internal processes**: Suggest they check with LCT team
- **Vitraya AI algorithms**: Black box, focus on integration
- **Medical terminology**: Explain simply, suggest they verify with clinical team
- **Legal/compliance**: Suggest consulting legal team

---

## 🚀 Quick Start Checklist

When starting a new session:
1. [ ] Read CLAUDE.md for context
2. [ ] Check which file user wants to work with (HTML vs React)
3. [ ] Ask about their current priority
4. [ ] Review relevant criteria (#1-31)
5. [ ] Propose small first step
6. [ ] Build incrementally
7. [ ] Test thoroughly
8. [ ] Explain clearly
9. [ ] Save progress
10. [ ] Celebrate small wins! 🎉

---

## 💡 Remember

- **This project saves lives** - better fraud detection = more healthcare coverage
- **Quality matters more than speed** - 90% accuracy is the gatekeeper
- **User is learning** - be patient, explain well, celebrate progress
- **Small steps work** - 31 criteria is overwhelming, one at a time is achievable

---

**Let's build something that transforms healthcare in Kenya! 🏥🇰🇪**
