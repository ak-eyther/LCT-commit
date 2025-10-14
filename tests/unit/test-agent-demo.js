// Test file to demonstrate multi-agent code review
// This file intentionally contains issues for each agent to detect

/**
 * Demo function showing how Sentinel, CodeRabbit, and Codex work together
 *
 * Sentinel should detect:
 * - Missing error handling (line 20)
 * - console.log statement (line 23)
 * - TODO comment (line 26)
 *
 * CodeRabbit should suggest:
 * - Better function naming
 * - Documentation improvements
 * - Performance optimizations
 *
 * Codex should analyze:
 * - Code patterns and structure
 * - Algorithm efficiency
 * - Context-aware improvements
 */

// Missing error handling - Sentinel will flag this as HIGH
async function fetchUserData(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const data = await response.json();
  console.log('User data:', data); // Sentinel will flag: remove console.log
  return data;
}

// TODO: Add input validation - Sentinel will flag this
function calculateDiscount(price, percentage) {
  // CodeRabbit might suggest: Add JSDoc comments
  // Codex might suggest: Validate inputs, handle edge cases
  return price * (percentage / 100);
}

// Good code example - all agents should approve
/**
 * Processes a healthcare claim with proper error handling
 * @param {Object} claim - The claim to process
 * @param {number} claim.amount - Claim amount in KES
 * @param {string} claim.memberId - Member identifier
 * @returns {Promise<Object>} Processed claim result
 */
async function processHealthcareClaim(claim) {
  try {
    // Input validation
    if (!claim || typeof claim.amount !== 'number' || !claim.memberId) {
      throw new Error('Invalid claim data');
    }

    if (claim.amount <= 0) {
      throw new Error('Claim amount must be positive');
    }

    // Process the claim
    const result = await validateAndProcess(claim);

    return {
      success: true,
      claimId: result.id,
      approvedAmount: result.approvedAmount,
    };
  } catch (error) {
    // Safe error handling - no data exposure
    return {
      success: false,
      error: 'Claim processing failed',
    };
  }
}

// Mock function for demo
function validateAndProcess(claim) {
  return Promise.resolve({
    id: 'CLM-' + Date.now(),
    approvedAmount: claim.amount * 0.95,
  });
}

module.exports = {
  fetchUserData,
  calculateDiscount,
  processHealthcareClaim,
};
