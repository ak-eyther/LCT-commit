// This should be detected as HIGH
async function fetchClaimData(claimId) {
  const response = await fetch(`/api/claims/${claimId}`);
  return response.json();
}

async function processInvoice(data) {
  const result = await validateInvoice(data);
  return result;
}
