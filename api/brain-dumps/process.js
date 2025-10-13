// Vercel Serverless Function for Brain Dumps
// Integrates with OpenAI GPT-4 to extract action items, decisions, and blockers

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System prompt for AI extraction
const SYSTEM_PROMPT = `You are a meeting notes analyzer. Extract structured information from business meeting notes.

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
- Return valid JSON only, no additional text`;

/**
 * Main handler for Brain Dumps processing
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function handler(req, res) {
  // CORS headers for frontend access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST to process meeting notes.'
    });
  }

  try {
    const { title, date, participants, notes } = req.body;

    // ==============================
    // INPUT VALIDATION
    // ==============================

    // Check required fields
    if (!title || !date || !notes) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, date, and notes are required.'
      });
    }

    // Validate title
    if (typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Meeting title must be a non-empty string.'
      });
    }

    // Validate date format (YYYY-MM-DD)
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Date must be in YYYY-MM-DD format.'
      });
    }

    // Validate notes length
    if (typeof notes !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Notes must be a string.'
      });
    }

    if (notes.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Notes must be at least 50 characters for meaningful extraction.'
      });
    }

    if (notes.length > 100000) {
      return res.status(400).json({
        success: false,
        error: 'Notes must not exceed 100,000 characters.'
      });
    }

    // ==============================
    // PHI/MEDICAL DATA DETECTION
    // ==============================

    // Check for healthcare/medical keywords (basic filter)
    const medicalKeywords = [
      'patient', 'diagnosis', 'prescription', 'medical record',
      'phi', 'hipaa', 'treatment', 'medication', 'symptom',
      'icd-10', 'cpt code', 'pharmacy', 'hospital admission'
    ];

    const notesLower = notes.toLowerCase();
    const foundKeywords = medicalKeywords.filter(kw => notesLower.includes(kw));

    if (foundKeywords.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Medical/healthcare data detected: "${foundKeywords.join('", "')}". This tool is for business meetings only.`
      });
    }

    // ==============================
    // OPENAI API CALL
    // ==============================

    // Construct user message with meeting details
    const userMessage = `Meeting: ${title}
Date: ${date}
Participants: ${participants || 'Not specified'}

Notes:
${notes}`;

    // Call OpenAI GPT-4 with structured output
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,  // Lower temperature for consistent extraction
      max_tokens: 2000   // Sufficient for most meeting extractions
    });

    // Extract and parse JSON response
    const aiResponse = completion.choices[0].message.content;
    const extracted = JSON.parse(aiResponse);

    // ==============================
    // VALIDATE AI RESPONSE STRUCTURE
    // ==============================

    if (!extracted.action_items || !Array.isArray(extracted.action_items)) {
      throw new Error('Invalid AI response: missing or invalid action_items array');
    }

    if (!extracted.decisions || !Array.isArray(extracted.decisions)) {
      throw new Error('Invalid AI response: missing or invalid decisions array');
    }

    if (!extracted.blockers || !Array.isArray(extracted.blockers)) {
      throw new Error('Invalid AI response: missing or invalid blockers array');
    }

    // ==============================
    // SUCCESS RESPONSE
    // ==============================

    return res.status(200).json({
      success: true,
      meeting_id: Date.now(),
      results: {
        action_items: extracted.action_items,
        decisions: extracted.decisions,
        blockers: extracted.blockers
      },
      metadata: {
        model: completion.model,
        tokens_used: completion.usage.total_tokens,
        processing_time: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Brain Dumps API Error:', error);

    // ==============================
    // ERROR HANDLING
    // ==============================

    // OpenAI-specific errors
    if (error.code === 'insufficient_quota') {
      return res.status(429).json({
        success: false,
        error: 'API quota exceeded. Please try again later or contact support.'
      });
    }

    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please wait a moment and try again.'
      });
    }

    if (error.code === 'invalid_api_key') {
      return res.status(500).json({
        success: false,
        error: 'Server configuration error. Please contact support.'
      });
    }

    // JSON parsing errors
    if (error instanceof SyntaxError) {
      return res.status(500).json({
        success: false,
        error: 'Failed to parse AI response. Please try again.'
      });
    }

    // Generic error response (don't expose internal details)
    return res.status(500).json({
      success: false,
      error: 'Failed to process meeting notes. Please try again or contact support if the issue persists.'
    });
  }
}
