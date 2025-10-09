// This should pass all checks
async function processInvoice(invoiceData) {
  try {
    // Validate inputs
    if (!invoiceData || typeof invoiceData.amount !== 'number') {
      throw new Error('Invalid invoice data');
    }

    // Use environment variable for API key
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Parameterized query (safe from SQL injection)
    const result = await db.query(
      'SELECT * FROM invoices WHERE id = ?',
      [invoiceData.id]
    );

    return { success: true, result };
  } catch (error) {
    console.error('Invoice processing failed');
    return { success: false, error: error.message };
  }
}
