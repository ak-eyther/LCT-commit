# OpenAI Agent Builder Configuration

**Feature:** Brain Dumps - Meeting Notes Processor
**Phase:** 2 (Backend Integration)
**Last Updated:** October 13, 2025

---

## 🎯 Purpose

This document provides instructions for configuring the OpenAI Agent Builder to extract action items, decisions, and blockers from business meeting notes.

**Important:** This configuration is currently handled directly in the backend API code (`api/brain-dumps/process.js`). If you want to use OpenAI's Agent Builder visual interface instead, follow the instructions below.

---

## 🔧 Option 1: Current Implementation (Recommended)

**Status:** ✅ Already Implemented

The backend API (`api/brain-dumps/process.js`) directly calls OpenAI's GPT-4 API with structured prompts. This approach:
- ✅ Gives full control over the prompt
- ✅ Works out of the box with no additional setup
- ✅ Easier to version control and test
- ✅ Lower latency (no intermediate agent layer)

**No additional setup required** - just set `OPENAI_API_KEY` in your `.env` file.

---

## 🧩 Option 2: OpenAI Agent Builder (Alternative)

If you prefer to use OpenAI's visual Agent Builder interface, follow these instructions:

### Step 1: Create New Agent

1. Go to [OpenAI Platform](https://platform.openai.com/) → **Agent Builder**
2. Click **"Create New Agent"**
3. Enter the following details:

---

### Step 2: Agent Configuration

#### Basic Settings

| Field | Value |
|-------|-------|
| **Agent Name** | Brain Dumps Meeting Extractor |
| **Model** | GPT-4 or GPT-4 Turbo |
| **Temperature** | 0.3 (for consistent extraction) |
| **Max Tokens** | 2000 |
| **Response Format** | JSON Object |

---

### Step 3: System Instructions

Copy and paste this exact prompt into the **System Instructions** field:

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

---

### Step 4: Guardrails (Optional)

Add these input validation rules:

**Input Requirements:**
- Minimum length: 50 characters
- Maximum length: 100,000 characters
- Required fields: title, date, notes

**Content Filters:**
Reject if input contains these keywords:
- patient, diagnosis, prescription, medical record
- phi, hipaa, treatment, medication, symptom
- icd-10, cpt code, pharmacy, hospital admission

**Reason:** This tool is for business meetings only, not healthcare data.

---

### Step 5: Test the Agent

Use this example meeting note to test:

**Test Input:**
```
Meeting: Sprint Planning - October 2025
Date: 2025-10-13
Participants: Sarah (PM), Mike (Dev), Alex (QA)

Notes:
Sprint planning meeting for Sprint 42. Discussed 3 user stories totaling 21 points.

Action Items:
- Sarah will create Jira tickets by Friday
- Mike to review API documentation before starting
- Alex needs to set up test environment

Decisions:
- Approved moving forward with microservices architecture
- Decided to postpone mobile app until Q1 2026

Blockers:
- AWS access still pending for Mike
- Waiting on design mockups from UX team
```

**Expected Output:**
```json
{
  "action_items": [
    {
      "task": "Create Jira tickets for Sprint 42",
      "owner": "Sarah",
      "due_date": "2025-10-18",
      "priority": "high"
    },
    {
      "task": "Review API documentation",
      "owner": "Mike",
      "due_date": null,
      "priority": "medium"
    },
    {
      "task": "Set up test environment",
      "owner": "Alex",
      "due_date": null,
      "priority": "high"
    }
  ],
  "decisions": [
    {
      "decision": "Move forward with microservices architecture",
      "context": "Technical architecture decision for Sprint 42",
      "impact": "Affects development approach for next quarter"
    },
    {
      "decision": "Postpone mobile app until Q1 2026",
      "context": "Timeline adjustment based on team capacity",
      "impact": "Mobile development delayed by one quarter"
    }
  ],
  "blockers": [
    {
      "description": "AWS access pending",
      "impact": "Blocking Mike from starting development work",
      "owner": "Mike"
    },
    {
      "description": "Waiting on design mockups from UX team",
      "impact": "Cannot finalize UI implementation",
      "owner": "UX team"
    }
  ]
}
```

---

### Step 6: Get Agent ID (If Using Agent Builder)

After creating the agent:
1. Click on the agent name
2. Copy the **Agent ID** from the URL or agent settings
3. Store it securely (you'll need it for API calls)

---

## 🔌 Integration with Backend

### If Using Agent Builder

Update `api/brain-dumps/process.js` to use the Agent Builder endpoint:

```javascript
// Replace the direct GPT-4 call with Agent Builder API call
const response = await openai.agents.run({
  agent_id: process.env.OPENAI_AGENT_ID,  // Add this to .env
  input: {
    meeting: title,
    date: date,
    participants: participants || 'Not specified',
    notes: notes
  }
});

const extracted = response.output;
```

**Environment Variable:**
Add to `.env`:
```bash
OPENAI_AGENT_ID=agent_abc123xyz  # Your agent ID from Step 6
```

---

## 📊 Cost Comparison

### Direct API (Current Implementation)
- **Cost:** ~$0.035 per meeting (~2,000 tokens)
- **Latency:** ~2-5 seconds
- **Control:** Full control over prompt and parameters

### Agent Builder
- **Cost:** Same as direct API + agent overhead
- **Latency:** ~3-7 seconds (additional agent layer)
- **Control:** Visual interface, easier to modify without code changes

**Recommendation:** Stick with direct API implementation (current) unless you need the visual interface for non-technical team members to modify the prompt.

---

## ✅ Verification Checklist

- [ ] Agent created in OpenAI Platform
- [ ] System instructions copied exactly as specified
- [ ] Temperature set to 0.3
- [ ] Response format set to JSON Object
- [ ] Guardrails configured (optional)
- [ ] Agent tested with example meeting notes
- [ ] Agent ID saved securely (if using Agent Builder)
- [ ] Backend updated to use agent (if using Agent Builder)
- [ ] Environment variable added (if using Agent Builder)

---

## 🐛 Troubleshooting

### Issue: Agent returns plain text instead of JSON

**Solution:** Ensure "Response Format" is set to "JSON Object" in agent settings.

---

### Issue: Agent extracts incorrect priorities

**Solution:** Review the "Priority levels" section in system instructions. Ensure the prompt clearly defines critical/high/medium/low.

---

### Issue: Agent rejects valid business meetings

**Solution:** Review the guardrails/content filters. You may need to adjust the keyword list if it's too restrictive.

---

### Issue: High API costs

**Solution:**
1. Check if you're using GPT-4 Turbo (cheaper than GPT-4)
2. Reduce max_tokens if responses are consistently under 1000 tokens
3. Consider caching frequently processed meetings

---

## 📝 Notes

- **Current Status:** Backend uses direct API calls (Option 1)
- **Agent Builder:** Optional visual interface (Option 2)
- **Recommendation:** Keep using Option 1 unless visual editing is required
- **Migration:** If you want to switch to Agent Builder, follow Option 2 and update backend

---

## 🔗 Useful Links

- [OpenAI Agent Builder Docs](https://platform.openai.com/docs/guides/agents)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Pricing](https://openai.com/pricing)

---

**Last Updated:** October 13, 2025
**Maintained By:** Development Team
**Related Files:**
- `api/brain-dumps/process.js` (Backend API)
- `docs/features/brain-dumps/HANDOFF.md` (Phase handoff)
- `docs/features/brain-dumps/frontend-spec.md` (Frontend spec)
