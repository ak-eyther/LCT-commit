// Vercel Serverless Function for Brain Dumps
// Integrates with OpenAI GPT-4 to extract action items, decisions, and blockers
// Updated: October 14, 2025 - Added error handling infrastructure with tracking IDs

const OpenAI = require('openai');
const {
  ValidationError,
  handleOpenAIError,
  InternalServerError,
  generateErrorId,
} = require('../../src/lib/errors');
const {
  sendErrorResponse,
  sendSuccessResponse,
  setCORSHeaders,
  handlePreflightRequest,
  validateMethod,
} = require('../../src/lib/error-handler');
const { getOpenAIKey, validateConfig } = require('../../src/lib/config');

// Validate configuration on function cold start
const configValidation = validateConfig({ logWarnings: false });
if (!configValidation.valid) {
  const errorId = generateErrorId();
  console.error(`[${errorId}] Configuration validation failed`, {
    errorId,
    errors: configValidation.errors,
  });
}

// Initialize OpenAI client
let openai;
try {
  const apiKey = getOpenAIKey();
  openai = new OpenAI({ apiKey });
} catch (error) {
  const errorId = generateErrorId();
  console.error(`[${errorId}] Failed to initialize OpenAI client`, {
    errorId,
    error: error.message,
  });
  // OpenAI will be null, and requests will fail with clear error message
}

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
 * Validates request input
 * Throws ValidationError which is caught and handled by sendErrorResponse
 *
 * @param {Object} body - Request body
 * @throws {ValidationError} If validation fails
 */
function validateInput(body) {
  const { title, date, notes } = body;

  // Check required fields
  if (!title || !date || !notes) {
    throw new ValidationError('Missing required fields: title, date, and notes are required.');
  }

  // Validate title
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new ValidationError('Meeting title must be a non-empty string.');
  }

  // Validate date format (YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(date)) {
    throw new ValidationError('Date must be in YYYY-MM-DD format.');
  }

  // Validate notes type
  if (typeof notes !== 'string') {
    throw new ValidationError('Notes must be a string.');
  }

  // Validate notes length
  if (notes.length < 50) {
    throw new ValidationError(
      'Notes must be at least 50 characters for meaningful extraction.'
    );
  }

  if (notes.length > 100000) {
    throw new ValidationError('Notes must not exceed 100,000 characters.');
  }

  // PHI/Medical data detection
  const medicalKeywords = [
    'patient', 'diagnosis', 'prescription', 'medical record',
    'phi', 'hipaa', 'treatment', 'medication', 'symptom',
    'icd-10', 'cpt code', 'pharmacy', 'hospital admission'
  ];

  const notesLower = notes.toLowerCase();
  const foundKeywords = medicalKeywords.filter(kw => notesLower.includes(kw));

  if (foundKeywords.length > 0) {
    throw new ValidationError(
      `Medical/healthcare data detected: "${foundKeywords.join('", "')}". This tool is for business meetings only.`
    );
  }
}

/**
 * Validates AI response structure
 *
 * @param {Object} extracted - Parsed AI response
 * @throws {InternalServerError} If response structure is invalid
 */
function validateAIResponse(extracted) {
  if (!extracted.action_items || !Array.isArray(extracted.action_items)) {
    throw new InternalServerError(
      'Invalid AI response: missing or invalid action_items array. Please try again.'
    );
  }

  if (!extracted.decisions || !Array.isArray(extracted.decisions)) {
    throw new InternalServerError(
      'Invalid AI response: missing or invalid decisions array. Please try again.'
    );
  }

  if (!extracted.blockers || !Array.isArray(extracted.blockers)) {
    throw new InternalServerError(
      'Invalid AI response: missing or invalid blockers array. Please try again.'
    );
  }
}

/**
 * Main handler for Brain Dumps processing
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export default async function handler(req, res) {
  // Set CORS headers
  setCORSHeaders(res);

  // Handle preflight request
  if (handlePreflightRequest(req, res)) {
    return;
  }

  // Check if OpenAI client was initialized
  if (!openai) {
    return sendErrorResponse(
      res,
      new InternalServerError(
        'AI service not configured. Please contact support.',
        { metadata: { hint: 'OpenAI API key missing or invalid' } }
      )
    );
  }

  try {
    // ==============================
    // VALIDATION
    // ==============================

    // Validate HTTP method
    validateMethod(req, ['POST']);

    // Validate request input
    validateInput(req.body);

    const { title, date, participants, notes } = req.body;

    // ==============================
    // OPENAI API CALL
    // ==============================

    // Construct user message with meeting details
    const userMessage = `Meeting: ${title}
Date: ${date}
Participants: ${participants || 'Not specified'}

Notes:
${notes}`;

    let completion;
    try {
      // Call OpenAI GPT-4 Turbo with structured output (supports JSON mode)
      completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
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
    } catch (openaiError) {
      // Handle OpenAI-specific errors with proper error types
      throw handleOpenAIError(openaiError);
    }

    // ==============================
    // PARSE AND VALIDATE AI RESPONSE
    // ==============================

    let extracted;
    try {
      const aiResponse = completion.choices[0].message.content;
      extracted = JSON.parse(aiResponse);
    } catch (parseError) {
      throw new InternalServerError(
        'Failed to parse AI response. Please try again.',
        { metadata: { hint: 'JSON parsing failed' } }
      );
    }

    // Validate response structure
    validateAIResponse(extracted);

    // ==============================
    // SUCCESS RESPONSE
    // ==============================

    return sendSuccessResponse(res, {
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
    // ==============================
    // CENTRALIZED ERROR HANDLING
    // ==============================
    // All errors (ValidationError, ExternalAPIError, etc.) are handled here
    return sendErrorResponse(res, error);
  }
}
