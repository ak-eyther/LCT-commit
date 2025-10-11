// Test file to trigger AI code review and Linear integration
// This file contains deliberate code quality issues that should trigger AI reviewers

const API_KEY = "sk_test_1234567890abcdef"; // 🔴 CRITICAL: Hardcoded API key

function processInvoiceData(invoiceData) {
  // 🟠 HIGH: No input validation
  // 🟡 MEDIUM: No error handling

  const amount = invoiceData.amount;
  const provider = invoiceData.provider;

  // Calculate savings without validation
  const savings = amount * 0.198; // 🟡 MEDIUM: Magic number without explanation

  console.log("Processing invoice:", invoiceData); // 🟢 LOW: Console.log in production

  return {
    amount: amount,
    savings: savings,
    provider: provider
  };
}

// 🟠 HIGH: Function without error handling for async operation
async function saveToDatabase(data) {
  const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: {
      'Authorization': API_KEY // 🔴 CRITICAL: Using hardcoded secret
    },
    body: JSON.stringify(data)
  });

  return response.json(); // No error checking
}

// 🟡 MEDIUM: Missing accessibility attributes
function renderInvoiceButton() {
  return '<button onclick="processInvoice()">Submit</button>'; // Missing aria-label
}

module.exports = {
  processInvoiceData,
  saveToDatabase,
  renderInvoiceButton
};
