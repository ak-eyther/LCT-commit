// This should be detected as MEDIUM
function calculateSavings(billed, approved) {
  console.log('Calculating savings:', billed, approved);
  const savings = billed - approved;
  console.debug('Result:', savings);
  return savings;
}
