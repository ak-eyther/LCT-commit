# Brain Dumps - Phase Handoff Document

**Current Phase:** Phase 1 (Frontend) ✅ COMPLETE
**Next Phase:** Phase 2 (Backend Proxy + OpenAI Integration)
**Last Updated:** October 13, 2025
**Branch:** `feature/brain-dumps-frontend-first`

---

## 🎯 Phase 1 Summary - COMPLETE ✅

### What Was Built

1. **`src/app/brain-dumps.html`** (37 KB)
   - Complete standalone single-page application
   - Form for meeting notes input (title, date, participants, notes)
   - localStorage for drafts and history
   - Mock AI extraction results
   - Export to CSV/JSON
   - Responsive design with Tailwind CSS
   - XSS protection with HTML escaping

2. **`docs/features/brain-dumps/frontend-spec.md`**
   - Complete frontend specification
   - Data models and API contracts
   - Security considerations
   - Testing checklist
   - Performance metrics

3. **`docs/features/brain-dumps/HANDOFF.md`** (this file)
   - Phase-to-phase communication
   - Integration points for Phase 2
   - Technical decisions log

### Key Technical Decisions

| Decision                   | Rationale                                               | Status         |
| -------------------------- | ------------------------------------------------------- | -------------- |
| Vanilla JS (no React)      | Match existing lct-tracker-html.html pattern            | ✅ Implemented |
| Tailwind CSS CDN           | No build process, responsive out of the box             | ✅ Implemented |
| Terracotta Design System   | Professional Linear/Notion-inspired warm minimal design | ✅ Implemented |
| localStorage persistence   | Simple, no backend needed for Phase 1                   | ✅ Implemented |
| Mock data for testing      | Allow immediate testing without API                     | ✅ Implemented |
| Class-based architecture   | Clean separation of concerns                            | ✅ Implemented |
| Auto-save every 30 seconds | Prevent data loss                                       | ✅ Implemented |
| Standalone page navigation | Build single page first, add navigation later           | ✅ Implemented |

### Design System - Terracotta Theme

**Visual Identity:**

- **Primary Color:** `#d97757` (Terracotta/warm coral)
- **Design Language:** Linear/Notion/Figma-inspired professional interface
- **Aesthetic:** Warm minimal, clean, modern
- **Layout:** Fixed sidebar + main content area

**Color Palette:**

```css
/* Primary Actions & Accents */
--terracotta-primary: #d97757; /* Main brand color */
--terracotta-hover: #c86646; /* Hover states */
--terracotta-light: #fee2e2; /* Backgrounds, active states */

/* Neutrals */
--gray-50: #f9fafb; /* Page background */
--gray-100: #f3f4f6; /* Card backgrounds */
--gray-200: #e5e7eb; /* Borders */
--gray-700: #374151; /* Body text */
--gray-900: #111827; /* Headings */
```

**Component Styling:**

- **Sidebar:** White background with terracotta accents for active items
- **Buttons:** Terracotta primary buttons, gray secondary buttons
- **Form Inputs:** Gray borders, terracotta focus rings
- **Cards:** White with subtle shadows
- **Tables:** Zebra striping with terracotta badges
- **Status Badges:** Color-coded (green/yellow/orange/red) with terracotta for high priority

**Typography:**

- **Font Stack:** System fonts (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- **Headings:** Dark gray (#111827)
- **Body:** Medium gray (#374151)
- **Hierarchy:** Clear distinction between h1, h2, h3, and body text

**Responsive Design:**

- **Desktop (1024px+):** Fixed sidebar (250px wide) + scrollable main content
- **Tablet (768px - 1023px):** Collapsible sidebar or stacked layout
- **Mobile (<768px):** Full-width stacked layout, sidebar becomes drawer

**Navigation:**

- Currently shows only "🧠 Brain Dumps" (standalone page)
- Placeholder comment added: `<!-- Additional pages will be added later -->`
- Future pages will use same terracotta active state styling

### Testing Status

**Manual Testing:** ✅ Pending (Phase 1 final task)

- Form validation
- Mock data processing
- localStorage persistence
- Export functionality
- Responsive design

**Browser Testing:** ⏳ Pending

- Chrome, Firefox, Safari, Edge
- Mobile responsive testing

### Files Modified

```
✅ src/app/brain-dumps.html (NEW)
✅ docs/features/brain-dumps/frontend-spec.md (NEW)
✅ docs/features/brain-dumps/HANDOFF.md (NEW)
```

---

## 🚀 Phase 2 Requirements - Backend Integration

### Objectives

1. Create backend proxy at `/api/brain-dumps/process.js`
2. Integrate with OpenAI Agent Builder
3. Replace mock data with real AI extraction
4. Add error handling and validation
5. Deploy and test end-to-end

### Files to Create

```
api/brain-dumps/
  └── process.js                    ← Vercel serverless function

docs/features/brain-dumps/
  └── agent-builder-config.md       ← OpenAI Agent setup instructions

.env.example                         ← Update with OPENAI_API_KEY

.env                                 ← Add OPENAI_API_KEY (not committed)
```

---

## 🔌 Integration Point - Frontend to Backend

### Current Code (Phase 1 - Mock)

**File:** `src/app/brain-dumps.html`
**Method:** `BrainDumpsApp.processNotes()`
**Lines:** ~400-420

```javascript
async processNotes() {
    const formData = this.getFormData();

    // Validation
    if (!formData.title || !formData.date || !formData.notes) {
        alert('Please fill in all required fields (Title, Date, Notes).');
        return;
    }

    if (formData.notes.length < 50) {
        alert('Please enter at least 50 characters of notes for meaningful extraction.');
        return;
    }

    // Show loading state
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('processBtn').disabled = true;

    // ⚠️ REPLACE THIS IN PHASE 2 ⚠️
    setTimeout(() => {
        const mockResults = this.generateMockResults(formData);
        this.displayResults(mockResults, formData);
        this.saveToHistory(formData, mockResults);
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('processBtn').disabled = false;
    }, 2000);
}
```

### Phase 2 Code (Real API)

```javascript
async processNotes() {
    const formData = this.getFormData();

    // Validation (keep existing)
    if (!formData.title || !formData.date || !formData.notes) {
        alert('Please fill in all required fields (Title, Date, Notes).');
        return;
    }

    if (formData.notes.length < 50) {
        alert('Please enter at least 50 characters of notes for meaningful extraction.');
        return;
    }

    // Show loading state
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('processBtn').disabled = true;

    // ✅ NEW: Call real API
    try {
        const response = await fetch('/api/brain-dumps/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || 'Processing failed');
        }

        // Display results
        this.displayResults(data.results, formData);
        this.saveToHistory(formData, data.results);

    } catch (error) {
        console.error('Processing error:', error);
        alert(`Failed to process meeting notes: ${error.message}\n\nPlease try again or contact support.`);
    } finally {
        // Hide loading state
        document.getElementById('loadingState').classList.add('hidden');
        document.getElementById('processBtn').disabled = false;
    }
}
```

**Changes Summary:**

- Replace `setTimeout()` with `fetch()` call
- Add error handling with try-catch
- Display user-friendly error messages
- Use `finally` to ensure loading state is hidden

---

## 🤖 OpenAI Agent Builder Configuration

### Agent Setup (Manual - Do First)

1. Go to [OpenAI Platform](https://platform.openai.com/) → Agent Builder
2. Create new agent with these settings:

**Agent Name:** Brain Dumps Meeting Extractor

**Model:** GPT-4 (or GPT-4 Turbo for faster processing)

**System Instructions:**

```
You are a meeting notes analyzer. Extract structured information from business meeting notes.

IMPORTANT: Only process business meeting notes. Never process healthcare/medical data or PHI.

Extract and return JSON with this exact structure:
{
  "action_items": [
    {
      "task": "Clear description of action",
      "owner": "Person responsible (or null if unassigned)",
      "due_date": "YYYY-MM-DD or null if no deadline",
      "priority": "critical|high|medium|low"
    }
  ],
  "decisions": [
    {
      "decision": "What was decided",
      "context": "Why this decision was made",
      "impact": "Expected impact or outcome"
    }
  ],
  "blockers": [
    {
      "description": "What is blocking progress",
      "impact": "How this affects the project/team",
      "owner": "Person responsible to unblock"
    }
  ]
}

Extraction Guidelines:
- Action items: Look for tasks, todos, follow-ups, assignments
- Decisions: Look for choices made, approvals given, strategic direction
- Blockers: Look for issues, dependencies, risks, waiting-on items
- Be concise but complete - extract all relevant information
- If owner/due_date unknown, use null
- Priority levels:
  * critical: Urgent and important, must be done immediately
  * high: Important, should be done soon
  * medium: Nice-to-have, can be scheduled
  * low: Optional, backlog item
- Return valid JSON only, no additional text
```

**Response Format:**

- Set to: `JSON Object`

**Tools:** None needed for MVP

**Guardrails:**

- Input validation: 50-100,000 characters
- Reject any healthcare/medical data
- Reject any personally identifiable information (SSN, credit cards, etc.)

3. Save agent and note the Agent ID (if available)

---

## 📝 Backend API Specification

### Endpoint: POST /api/brain-dumps/process

**Request:**

```json
{
  "title": "string (required)",
  "date": "string (required, YYYY-MM-DD)",
  "participants": "string (optional)",
  "notes": "string (required, 50-100000 chars)"
}
```

**Response (Success):**

```json
{
  "success": true,
  "meeting_id": "number (timestamp)",
  "results": {
    "action_items": [...],
    "decisions": [...],
    "blockers": [...]
  }
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "string (error message)"
}
```

**Status Codes:**

- `200` - Success
- `400` - Bad request (validation error)
- `429` - Rate limit exceeded
- `500` - Server error

---

## 🔐 Backend Implementation Template

### File: `api/brain-dumps/process.js`

```javascript
// Vercel Serverless Function
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt (same as Agent Builder config)
const SYSTEM_PROMPT = `You are a meeting notes analyzer...
[COPY FULL PROMPT FROM AGENT BUILDER CONFIG ABOVE]`;

export default async function handler(req, res) {
  // CORS headers (if needed)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { title, date, participants, notes } = req.body;

    // ==============================
    // VALIDATION
    // ==============================

    if (!title || !date || !notes) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, date, notes',
      });
    }

    if (
      typeof notes !== 'string' ||
      notes.length < 50 ||
      notes.length > 100000
    ) {
      return res.status(400).json({
        success: false,
        error: 'Notes must be between 50 and 100,000 characters',
      });
    }

    // Check for PHI/medical keywords (basic filter)
    const medicalKeywords = [
      'patient',
      'diagnosis',
      'prescription',
      'medical record',
      'phi',
      'hipaa',
    ];
    const notesLower = notes.toLowerCase();
    const foundKeywords = medicalKeywords.filter(kw => notesLower.includes(kw));

    if (foundKeywords.length > 0) {
      return res.status(400).json({
        success: false,
        error:
          'Medical/healthcare data detected. This tool is for business meetings only.',
      });
    }

    // ==============================
    // OPENAI API CALL
    // ==============================

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Meeting: ${title}\nDate: ${date}\nParticipants: ${participants || 'Not specified'}\n\nNotes:\n${notes}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // Lower temperature for more consistent extraction
      max_tokens: 2000, // Adjust based on expected output size
    });

    // Parse JSON response
    const extracted = JSON.parse(completion.choices[0].message.content);

    // ==============================
    // VALIDATION OF AI RESPONSE
    // ==============================

    if (
      !extracted.action_items ||
      !extracted.decisions ||
      !extracted.blockers
    ) {
      throw new Error('Invalid AI response structure');
    }

    // ==============================
    // SUCCESS RESPONSE
    // ==============================

    return res.status(200).json({
      success: true,
      meeting_id: Date.now(),
      results: {
        action_items: extracted.action_items || [],
        decisions: extracted.decisions || [],
        blockers: extracted.blockers || [],
      },
    });
  } catch (error) {
    console.error('Brain Dumps API Error:', error);

    // OpenAI-specific errors
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        success: false,
        error: 'API quota exceeded. Please try again later.',
      });
    }

    // Generic error
    return res.status(500).json({
      success: false,
      error: 'Failed to process meeting notes. Please try again.',
    });
  }
}
```

---

## 📦 Dependencies to Install

### Option 1: Install OpenAI SDK (Recommended)

```bash
npm install openai
```

### Option 2: Use Fetch API (No dependency)

If you prefer not to add dependencies, use native `fetch()` to call OpenAI API directly.

---

## 🔑 Environment Variables

### Add to `.env`

```bash
# OpenAI API Key
OPENAI_API_KEY=sk-proj-...your-key-here...
```

### Update `.env.example`

```bash
# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-...
```

**Security:**

- ✅ `.env` is in `.gitignore` (never commit API keys)
- ✅ Use GitHub Secrets for CI/CD deployments
- ✅ Vercel automatically loads `.env` variables

---

## ✅ Phase 2 Testing Checklist

### Backend Testing

- [ ] API endpoint responds to POST requests
- [ ] Validation rejects missing fields
- [ ] Validation rejects notes < 50 chars
- [ ] Validation rejects notes > 100k chars
- [ ] PHI/medical keyword detection works
- [ ] OpenAI API call succeeds
- [ ] JSON parsing works correctly
- [ ] Error handling returns user-friendly messages
- [ ] Rate limiting is handled gracefully

### Integration Testing

- [ ] Frontend successfully calls backend
- [ ] Loading state shows during processing
- [ ] Results display correctly after API response
- [ ] Error messages display in UI
- [ ] Action items extracted accurately
- [ ] Decisions extracted accurately
- [ ] Blockers extracted accurately
- [ ] Due dates parsed correctly (YYYY-MM-DD)
- [ ] Priorities assigned correctly

### End-to-End Testing

- [ ] Submit example meeting notes
- [ ] Verify extraction quality
- [ ] Export CSV includes API data
- [ ] Export JSON includes API data
- [ ] History saves API results
- [ ] Reload from history works

---

## 💰 Cost Estimates

### OpenAI API Costs (GPT-4)

- Input: $0.01 per 1k tokens
- Output: $0.03 per 1k tokens

### Per Meeting Estimate

- Average input: 2,000 tokens (1,500-word meeting notes)
- Average output: 500 tokens (structured JSON)
- **Cost per meeting:** ~$0.035 ($0.02 input + $0.015 output)

### Monthly Estimates

- 100 meetings/month: **$3.50**
- 500 meetings/month: **$17.50**
- 1,000 meetings/month: **$35.00**

**Well within $300/month budget!**

---

## 🚨 Known Issues & Limitations

### Phase 1 Limitations (Carried Over)

1. ✅ Mock data only → **Fixed in Phase 2**
2. No backend persistence (localStorage only)
3. No user authentication
4. No collaboration features
5. No Linear integration
6. No email notifications

### Phase 2 Potential Issues

1. **OpenAI API rate limits** - May need retry logic
2. **Token limit** - Very long meetings might exceed context window
3. **Cost management** - No billing alerts yet
4. **Extraction quality** - May need prompt tuning
5. **Network errors** - Need better error handling

---

## 🎯 Success Criteria for Phase 2

### Minimum Viable

- [ ] Backend API deployed to Vercel
- [ ] OpenAI integration working
- [ ] Frontend successfully calls API
- [ ] Results display correctly
- [ ] Error handling works
- [ ] Passes Sentinel security review

### Ideal

- [ ] Extraction accuracy > 90%
- [ ] Processing time < 10 seconds
- [ ] No security vulnerabilities
- [ ] User-friendly error messages
- [ ] Graceful degradation (fallback to mock if API fails)

---

## 📞 Handoff to Phase 2 Agent

### For Next Agent (Code-Architect)

**Task Summary:**
"Build backend proxy for Brain Dumps at `/api/brain-dumps/process.js`. Integrate with OpenAI GPT-4 to extract action items, decisions, and blockers from business meeting notes. Frontend is complete and ready for integration."

**Context Files to Read:**

1. `docs/features/brain-dumps/HANDOFF.md` (this file)
2. `docs/features/brain-dumps/frontend-spec.md`
3. `src/app/brain-dumps.html` (optional, for reference)

**Key Decisions Already Made:**

- Use Vercel serverless function (not Express)
- OpenAI GPT-4 (not GPT-3.5 or other models)
- JSON response format (already validated by frontend)
- No database persistence in Phase 2 (localStorage sufficient for MVP)

**Integration Point:**

- Frontend calls: `POST /api/brain-dumps/process`
- Expected response format: `{ success: true, meeting_id: number, results: {...} }`

**Testing:**

- Test with example meeting notes in `brain-dumps.html` (Load Example button)
- Verify extraction quality manually
- Run Sentinel review before committing

**Stop Condition:**

- If context reaches 70k tokens (140k total), create checkpoint and exit

---

## 📝 Phase 3+ Planning (Future)

### Phase 3: Database Persistence

- Use existing PostgreSQL (`@vercel/postgres`)
- Store meetings, action items, decisions, blockers
- Enable search and filtering

### Phase 4: Linear Integration

- Sync action items to Linear automatically
- Use existing Linear API integration

### Phase 5: Collaboration

- User authentication (existing system)
- Share meetings via URL
- Team workspaces

---

## 🎉 Phase 1 Complete!

**Total Time:** ~2 hours
**Files Created:** 3
**Lines of Code:** ~1,200
**Context Used:** 68k / 200k (34%)

**Status:** ✅ Ready for Phase 2

**Next Steps:**

1. Test frontend in browser (open `src/app/brain-dumps.html`)
2. Verify all features work with mock data
3. Commit Phase 1 files
4. Launch Phase 2 with code-architect agent

---

**End of Phase 1 Handoff Document**
