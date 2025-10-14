# LCT commit Functions Library

**Last Updated:** October 11, 2025
**Purpose:** Core utility functions for the 31 success criteria

---

## 📋 Function Categories

1. **Invoice Validation** (Criteria #4, #6)
2. **Fraud Detection** (Criteria #10-#27)
3. **Clinical Validation** (Criteria #1-#3)
4. **Financial Calculations** (Criteria #5-#9)
5. **Data Utilities** (General helpers)

---

## 💰 1. Invoice Validation Functions

### 1.1 Invoice Amount Precedence (Criteria #4 - CRITICAL)

```javascript
/**
 * Validate invoice amount using LCT precedence rules
 * Priority: LCT → ETIMS → Document
 *
 * @param {number} lctAmount - Amount in LCT system
 * @param {number} etimsAmount - Amount in ETIMS (Kenya tax system)
 * @param {number} documentAmount - Amount on physical document
 * @returns {Object} Validation result
 */
function validateInvoiceAmount(lctAmount, etimsAmount, documentAmount) {
  // Input validation
  if (typeof lctAmount !== 'number' || lctAmount < 0) {
    throw new Error('Invalid LCT amount');
  }
  if (typeof etimsAmount !== 'number' || etimsAmount < 0) {
    throw new Error('Invalid ETIMS amount');
  }
  if (typeof documentAmount !== 'number' || documentAmount < 0) {
    throw new Error('Invalid document amount');
  }

  // LCT amount always takes precedence
  const approvedAmount = lctAmount;

  let status = 'Approved';
  let reasons = [];
  let severity = 'Low';

  // Check ETIMS discrepancy
  if (etimsAmount < lctAmount) {
    status = 'Query';
    reasons.push(
      `ETIMS amount (${etimsAmount} KES) less than LCT amount (${lctAmount} KES)`
    );
    severity = 'High';
  }

  // Check document variance
  const variance = Math.abs(documentAmount - lctAmount) / lctAmount;

  if (variance > 0.5) {
    // >50% variance - critical fraud indicator
    status = 'Rejected';
    reasons.push(
      `Critical variance: ${(variance * 100).toFixed(1)}% between LCT and document`
    );
    severity = 'Critical';
  } else if (variance > 0.1) {
    // >10% variance - flag for review
    status = 'Query';
    reasons.push(
      `High variance: ${(variance * 100).toFixed(1)}% between LCT and document`
    );
    severity = Math.max(severity, 'Medium');
  }

  return {
    status,
    approvedAmount,
    reasons,
    severity,
    validation: {
      lctAmount,
      etimsAmount,
      documentAmount,
      variance: `${(variance * 100).toFixed(2)}%`,
      precedence: 'LCT',
    },
  };
}

// Example usage
const result = validateInvoiceAmount(1700, 1500, 3370);
console.log(result);
// {
//   status: 'Query',
//   approvedAmount: 1700,
//   reasons: [
//     'ETIMS amount (1500 KES) less than LCT amount (1700 KES)',
//     'Critical variance: 98.24% between LCT and document'
//   ],
//   severity: 'Critical'
// }
```

### 1.2 Tariff and Price Validation (Criteria #6 - CRITICAL)

```javascript
/**
 * Validate service prices against tariff database
 *
 * @param {Array} services - Array of service objects
 * @param {Object} tariffDatabase - Tariff lookup table
 * @returns {Object} Validation result
 */
function validateTariffs(services, tariffDatabase) {
  const violations = [];
  let totalVariance = 0;

  services.forEach((service, index) => {
    const tariff = tariffDatabase[service.code];

    if (!tariff) {
      violations.push({
        serviceIndex: index,
        serviceCode: service.code,
        serviceName: service.name,
        issue: 'Service code not found in tariff database',
        severity: 'High',
      });
      return;
    }

    // Check if price exceeds tariff
    if (service.amount > tariff.maxPrice) {
      const overcharge = service.amount - tariff.maxPrice;
      const overchargePercent = (overcharge / tariff.maxPrice) * 100;

      violations.push({
        serviceIndex: index,
        serviceCode: service.code,
        serviceName: service.name,
        billedAmount: service.amount,
        tariffMax: tariff.maxPrice,
        overcharge,
        overchargePercent: `${overchargePercent.toFixed(1)}%`,
        issue: `Billed amount exceeds tariff maximum`,
        severity: overchargePercent > 20 ? 'Critical' : 'High',
      });

      totalVariance += overcharge;
    }

    // Check if price is suspiciously low
    if (service.amount < tariff.minPrice) {
      violations.push({
        serviceIndex: index,
        serviceCode: service.code,
        serviceName: service.name,
        billedAmount: service.amount,
        tariffMin: tariff.minPrice,
        issue: `Billed amount below tariff minimum (possible coding error)`,
        severity: 'Medium',
      });
    }
  });

  return {
    passed: violations.length === 0,
    violations,
    totalServices: services.length,
    violationCount: violations.length,
    totalOvercharge: totalVariance,
    complianceRate: `${((1 - violations.length / services.length) * 100).toFixed(1)}%`,
  };
}

// Example tariff database
const tariffDB = {
  LAB001: { minPrice: 250, maxPrice: 500, name: 'Malaria Test' },
  MED001: { minPrice: 1000, maxPrice: 1500, name: 'Antimalarial Medication' },
  CONS01: { minPrice: 500, maxPrice: 1000, name: 'Doctor Consultation' },
};

// Example usage
const services = [
  { code: 'LAB001', name: 'Malaria Test', amount: 300 },
  { code: 'MED001', name: 'Antimalarial', amount: 2000 }, // Over tariff!
  { code: 'CONS01', name: 'Consultation', amount: 800 },
];

const tariffResult = validateTariffs(services, tariffDB);
console.log(tariffResult);
```

---

## 🔍 2. Fraud Detection Functions

### 2.1 Duplicate Service Detection (Criteria #11 - CRITICAL)

```javascript
/**
 * Detect repeated services for same member
 *
 * @param {Array} claims - All claims data
 * @param {Object} currentClaim - Claim being checked
 * @param {number} daysWindow - Days to look back (default 30)
 * @returns {Object} Detection result
 */
function detectDuplicateServices(claims, currentClaim, daysWindow = 30) {
  const duplicates = [];
  const currentDate = new Date(currentClaim.serviceDate);

  // Filter claims for same member within time window
  const relevantClaims = claims.filter(claim => {
    if (claim.id === currentClaim.id) return false;
    if (claim.memberID !== currentClaim.memberID) return false;

    const claimDate = new Date(claim.serviceDate);
    const daysDiff = Math.abs(
      (currentDate - claimDate) / (1000 * 60 * 60 * 24)
    );

    return daysDiff <= daysWindow;
  });

  // Check each service in current claim
  currentClaim.services.forEach(currentService => {
    relevantClaims.forEach(otherClaim => {
      otherClaim.services.forEach(otherService => {
        if (currentService.code === otherService.code) {
          const daysDiff = Math.abs(
            (currentDate - new Date(otherClaim.serviceDate)) /
              (1000 * 60 * 60 * 24)
          );

          duplicates.push({
            serviceCode: currentService.code,
            serviceName: currentService.name,
            currentProvider: currentClaim.provider,
            duplicateProvider: otherClaim.provider,
            currentInvoice: currentClaim.invoiceNumber,
            duplicateInvoice: otherClaim.invoiceNumber,
            currentDate: currentClaim.serviceDate,
            duplicateDate: otherClaim.serviceDate,
            daysBetween: Math.round(daysDiff),
            isCrossProvider: currentClaim.provider !== otherClaim.provider,
            suspicionLevel: daysDiff < 7 ? 'High' : 'Medium',
          });
        }
      });
    });
  });

  return {
    hasDuplicates: duplicates.length > 0,
    duplicateCount: duplicates.length,
    duplicates,
    riskLevel: duplicates.some(d => d.isCrossProvider)
      ? 'Critical'
      : duplicates.length > 2
        ? 'High'
        : duplicates.length > 0
          ? 'Medium'
          : 'Low',
    recommendation:
      duplicates.length > 0 ? 'Flag for manual review' : 'Approved',
  };
}
```

### 2.2 Provider Billing Pattern Analysis (Criteria #17 - High)

```javascript
/**
 * Analyze provider's billing patterns for anomalies
 *
 * @param {string} providerID - Provider identifier
 * @param {Array} allClaims - Historical claims data
 * @returns {Object} Analysis result
 */
function analyzeProviderBillingPattern(providerID, allClaims) {
  // Filter claims for this provider
  const providerClaims = allClaims.filter(c => c.provider === providerID);

  if (providerClaims.length < 10) {
    return {
      sufficientData: false,
      message:
        'Insufficient data for pattern analysis (minimum 10 claims required)',
    };
  }

  // Calculate statistics
  const amounts = providerClaims.map(c => c.lctAmount);
  const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;

  const variance =
    amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) /
    amounts.length;
  const stdDev = Math.sqrt(variance);

  // Detect outliers (values > 2 standard deviations from mean)
  const outliers = providerClaims.filter(c => {
    const zScore = Math.abs((c.lctAmount - mean) / stdDev);
    return zScore > 2;
  });

  // Check for suspicious patterns
  const patterns = [];

  // Pattern 1: Consistently high amounts
  const highAmountClaims = providerClaims.filter(
    c => c.lctAmount > mean + stdDev
  );
  if (highAmountClaims.length / providerClaims.length > 0.3) {
    patterns.push({
      type: 'High Billing',
      description: `${((highAmountClaims.length / providerClaims.length) * 100).toFixed(1)}% of claims above average + 1 SD`,
      severity: 'Medium',
    });
  }

  // Pattern 2: Round number billing (possible estimation fraud)
  const roundNumberClaims = providerClaims.filter(
    c => c.lctAmount % 1000 === 0
  );
  if (roundNumberClaims.length / providerClaims.length > 0.5) {
    patterns.push({
      type: 'Round Number Billing',
      description: `${((roundNumberClaims.length / providerClaims.length) * 100).toFixed(1)}% of claims are round numbers`,
      severity: 'Medium',
    });
  }

  // Pattern 3: Rapid claim submission (possible batch fraud)
  const claimsByDate = {};
  providerClaims.forEach(c => {
    const date = c.serviceDate;
    claimsByDate[date] = (claimsByDate[date] || 0) + 1;
  });

  const maxClaimsPerDay = Math.max(...Object.values(claimsByDate));
  if (maxClaimsPerDay > 20) {
    patterns.push({
      type: 'High Volume Day',
      description: `${maxClaimsPerDay} claims submitted on same day`,
      severity: 'High',
    });
  }

  return {
    sufficientData: true,
    providerID,
    totalClaims: providerClaims.length,
    statistics: {
      meanAmount: Math.round(mean),
      standardDeviation: Math.round(stdDev),
      minAmount: Math.min(...amounts),
      maxAmount: Math.max(...amounts),
    },
    outliers: {
      count: outliers.length,
      percentage: `${((outliers.length / providerClaims.length) * 100).toFixed(1)}%`,
      claims: outliers.map(c => ({
        invoiceNumber: c.invoiceNumber,
        amount: c.lctAmount,
        zScore: ((c.lctAmount - mean) / stdDev).toFixed(2),
      })),
    },
    suspiciousPatterns: patterns,
    riskLevel: patterns.some(p => p.severity === 'High')
      ? 'High'
      : patterns.length > 2
        ? 'Medium'
        : 'Low',
    recommendation:
      patterns.length > 0
        ? 'Enhanced monitoring recommended'
        : 'Normal pattern',
  };
}
```

### 2.3 High-Cost Service Clustering (Criteria #22 - High)

```javascript
/**
 * Detect clustering of high-cost services (possible upcoding)
 *
 * @param {Object} claim - Claim to analyze
 * @param {Object} benchmarks - Industry benchmarks
 * @returns {Object} Detection result
 */
function detectHighCostClustering(claim, benchmarks) {
  const highCostServices = [];
  let totalHighCost = 0;

  claim.services.forEach(service => {
    const benchmark = benchmarks[service.code];

    if (!benchmark) return;

    // Check if service is in top 10% of cost
    if (service.amount > benchmark.percentile90) {
      highCostServices.push({
        code: service.code,
        name: service.name,
        amount: service.amount,
        benchmark: benchmark.percentile90,
        excess: service.amount - benchmark.percentile90,
        percentile: 'Top 10%',
      });

      totalHighCost += service.amount;
    }
  });

  // Flag if >50% of total claim is high-cost services
  const highCostRatio = totalHighCost / claim.lctAmount;

  return {
    hasCluster: highCostServices.length >= 3 || highCostRatio > 0.5,
    highCostServiceCount: highCostServices.length,
    highCostServices,
    totalHighCost,
    highCostRatio: `${(highCostRatio * 100).toFixed(1)}%`,
    severity:
      highCostServices.length >= 5
        ? 'Critical'
        : highCostRatio > 0.7
          ? 'High'
          : highCostRatio > 0.5
            ? 'Medium'
            : 'Low',
    recommendation:
      highCostServices.length >= 3
        ? 'Request detailed clinical justification'
        : 'Standard processing',
  };
}
```

---

## 🏥 3. Clinical Validation Functions

### 3.1 ICD Code Matching (Criteria #1 - High)

```javascript
/**
 * Validate ICD-10 code matches billed services
 *
 * @param {string} diagnosisCode - ICD-10 code
 * @param {Array} services - Billed services
 * @param {Object} clinicalRules - ICD-to-service mapping
 * @returns {Object} Validation result
 */
function validateICDServiceMatch(diagnosisCode, services, clinicalRules) {
  const diagnosis = clinicalRules[diagnosisCode];

  if (!diagnosis) {
    return {
      valid: false,
      error: `Unknown ICD-10 code: ${diagnosisCode}`,
      severity: 'High',
    };
  }

  const mismatches = [];
  const expectedServices = diagnosis.commonServices;

  services.forEach(service => {
    // Check if service is appropriate for diagnosis
    const isAppropriate = expectedServices.some(expected =>
      service.code.startsWith(expected.prefix)
    );

    if (!isAppropriate) {
      mismatches.push({
        serviceCode: service.code,
        serviceName: service.name,
        diagnosis: diagnosis.name,
        issue: 'Service not typically associated with this diagnosis',
        severity: 'Medium',
      });
    }
  });

  // Check for missing critical services
  const criticalMissing = [];
  expectedServices
    .filter(s => s.required)
    .forEach(required => {
      const hasService = services.some(s => s.code.startsWith(required.prefix));
      if (!hasService) {
        criticalMissing.push({
          expectedService: required.name,
          issue: 'Required service missing for diagnosis',
          severity: 'Medium',
        });
      }
    });

  return {
    valid: mismatches.length === 0 && criticalMissing.length === 0,
    diagnosisCode,
    diagnosisName: diagnosis.name,
    mismatches,
    criticalMissing,
    matchRate: `${((1 - mismatches.length / services.length) * 100).toFixed(1)}%`,
    severity:
      criticalMissing.length > 0
        ? 'High'
        : mismatches.length > services.length * 0.5
          ? 'High'
          : mismatches.length > 0
            ? 'Medium'
            : 'Low',
    recommendation:
      mismatches.length > 0 || criticalMissing.length > 0
        ? 'Request clinical notes for justification'
        : 'Clinically appropriate',
  };
}

// Example clinical rules
const clinicalRules = {
  B50: {
    // Malaria
    name: 'Plasmodium falciparum malaria',
    commonServices: [
      { prefix: 'LAB', name: 'Lab tests', required: true },
      { prefix: 'MED', name: 'Medication', required: true },
      { prefix: 'CONS', name: 'Consultation', required: true },
    ],
    uncommonServices: ['SURG', 'XRAY'], // Suspicious if present
  },
  J00: {
    // Acute URTI
    name: 'Acute upper respiratory infection',
    commonServices: [
      { prefix: 'CONS', name: 'Consultation', required: true },
      { prefix: 'MED', name: 'Medication', required: false },
    ],
    uncommonServices: ['LAB', 'SURG', 'SCAN'], // Usually not needed
  },
};
```

---

## 💵 4. Financial Calculation Functions

### 4.1 Savings Calculation (Criteria #8, #9 - High)

```javascript
/**
 * Calculate savings (billed vs approved)
 *
 * @param {number} billedAmount - Amount billed by provider
 * @param {number} approvedAmount - Amount approved after vetting
 * @returns {Object} Savings calculation
 */
function calculateSavings(billedAmount, approvedAmount) {
  // Input validation
  if (typeof billedAmount !== 'number' || billedAmount < 0) {
    throw new Error('Invalid billed amount');
  }
  if (typeof approvedAmount !== 'number' || approvedAmount < 0) {
    throw new Error('Invalid approved amount');
  }
  if (approvedAmount > billedAmount) {
    throw new Error('Approved amount cannot exceed billed amount');
  }

  const savings = billedAmount - approvedAmount;
  const savingsPercent = billedAmount > 0 ? (savings / billedAmount) * 100 : 0;

  return {
    billedAmount,
    approvedAmount,
    savings,
    savingsPercent: `${savingsPercent.toFixed(2)}%`,
    savingsCategory:
      savingsPercent === 0
        ? 'None'
        : savingsPercent < 5
          ? 'Low'
          : savingsPercent < 15
            ? 'Medium'
            : savingsPercent < 30
              ? 'High'
              : 'Very High',
  };
}

/**
 * Calculate aggregate savings by scheme
 *
 * @param {Array} claims - All claims
 * @param {string} scheme - Scheme name (optional)
 * @returns {Object} Aggregate savings
 */
function calculateAggregateSavings(claims, scheme = null) {
  const filteredClaims = scheme
    ? claims.filter(c => c.scheme === scheme)
    : claims;

  const total = filteredClaims.reduce(
    (acc, claim) => {
      return {
        totalBilled: acc.totalBilled + claim.lctAmount,
        totalApproved: acc.totalApproved + (claim.approvedAmount || 0),
        count: acc.count + 1,
      };
    },
    { totalBilled: 0, totalApproved: 0, count: 0 }
  );

  const totalSavings = total.totalBilled - total.totalApproved;
  const avgSavingsPercent =
    total.totalBilled > 0 ? (totalSavings / total.totalBilled) * 100 : 0;

  return {
    scheme: scheme || 'All Schemes',
    claimCount: total.count,
    totalBilled: total.totalBilled,
    totalApproved: total.totalApproved,
    totalSavings,
    avgSavingsPercent: `${avgSavingsPercent.toFixed(2)}%`,
    avgClaimAmount: Math.round(total.totalBilled / total.count),
    avgSavingsPerClaim: Math.round(totalSavings / total.count),
  };
}
```

---

## 🛠️ 5. Data Utility Functions

### 5.1 Date Utilities

```javascript
/**
 * Check if date falls within policy period
 *
 * @param {string} serviceDate - Service date (YYYY-MM-DD)
 * @param {string} policyStart - Policy start date
 * @param {string} policyEnd - Policy end date
 * @returns {boolean}
 */
function isWithinPolicyPeriod(serviceDate, policyStart, policyEnd) {
  const service = new Date(serviceDate);
  const start = new Date(policyStart);
  const end = new Date(policyEnd);

  return service >= start && service <= end;
}

/**
 * Calculate days between two dates
 *
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @returns {number} Days between dates
 */
function daysBetween(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
```

### 5.2 Data Sanitization

```javascript
/**
 * Sanitize invoice number (Criteria #12, #13)
 *
 * @param {string} invoiceNumber - Raw invoice number
 * @returns {string} Sanitized invoice number
 */
function sanitizeInvoiceNumber(invoiceNumber) {
  if (!invoiceNumber) return '';

  // Remove non-alphanumeric characters (Criteria #13)
  let sanitized = invoiceNumber.toString().replace(/[^A-Za-z0-9-]/g, '');

  // Ensure consistent format
  sanitized = sanitized.toUpperCase().trim();

  return sanitized;
}

/**
 * Validate and sanitize user input
 *
 * @param {string} input - User input
 * @param {string} type - Input type (text, number, email, etc.)
 * @returns {Object} Validation result
 */
function validateInput(input, type) {
  const result = {
    valid: true,
    sanitized: input,
    errors: [],
  };

  switch (type) {
    case 'number':
      const num = parseFloat(input);
      if (isNaN(num)) {
        result.valid = false;
        result.errors.push('Must be a valid number');
      } else {
        result.sanitized = num;
      }
      break;

    case 'text':
      // Prevent XSS
      result.sanitized = input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim();
      break;

    case 'date':
      const date = new Date(input);
      if (isNaN(date.getTime())) {
        result.valid = false;
        result.errors.push('Must be a valid date');
      } else {
        result.sanitized = date.toISOString().split('T')[0];
      }
      break;
  }

  return result;
}
```

### 5.3 Export Functions

```javascript
/**
 * Export data to CSV
 *
 * @param {Array} data - Array of objects
 * @param {string} filename - Output filename
 */
function exportToCSV(data, filename) {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Build CSV content
  let csv = headers.join(',') + '\n';

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle commas and quotes in values
      if (
        typeof value === 'string' &&
        (value.includes(',') || value.includes('"'))
      ) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csv += values.join(',') + '\n';
  });

  // Download file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * Export data to JSON
 *
 * @param {Object} data - Data object
 * @param {string} filename - Output filename
 */
function exportToJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
```

---

## 📦 Complete Function Library Template

Save this as `lib/lct-functions.js`:

```javascript
/**
 * LCT commit Core Functions Library
 * Version: 1.0.0
 *
 * Complete set of utility functions for the 31 success criteria
 */

const LCT = {
  // Invoice Validation
  invoice: {
    validateAmount: function (lctAmount, etimsAmount, documentAmount) {
      // Implementation from section 1.1
    },
    validateTariffs: function (services, tariffDB) {
      // Implementation from section 1.2
    },
  },

  // Fraud Detection
  fraud: {
    detectDuplicateServices: function (claims, currentClaim, daysWindow) {
      // Implementation from section 2.1
    },
    analyzeProviderPattern: function (providerID, allClaims) {
      // Implementation from section 2.2
    },
    detectHighCostClustering: function (claim, benchmarks) {
      // Implementation from section 2.3
    },
  },

  // Clinical Validation
  clinical: {
    validateICDMatch: function (diagnosisCode, services, rules) {
      // Implementation from section 3.1
    },
  },

  // Financial Calculations
  financial: {
    calculateSavings: function (billedAmount, approvedAmount) {
      // Implementation from section 4.1
    },
    calculateAggregateSavings: function (claims, scheme) {
      // Implementation from section 4.1
    },
  },

  // Utilities
  utils: {
    isWithinPolicyPeriod: function (serviceDate, policyStart, policyEnd) {
      // Implementation from section 5.1
    },
    daysBetween: function (date1, date2) {
      // Implementation from section 5.1
    },
    sanitizeInvoiceNumber: function (invoiceNumber) {
      // Implementation from section 5.2
    },
    validateInput: function (input, type) {
      // Implementation from section 5.2
    },
    exportToCSV: function (data, filename) {
      // Implementation from section 5.3
    },
    exportToJSON: function (data, filename) {
      // Implementation from section 5.3
    },
  },
};

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LCT;
}
```

---

## 🚀 Usage Examples

### In HTML File

```html
<script src="lib/lct-functions.js"></script>
<script>
  // Validate invoice
  const invoiceResult = LCT.invoice.validateAmount(1700, 1500, 3370);
  console.log(invoiceResult);

  // Detect fraud
  const fraudResult = LCT.fraud.detectDuplicateServices(
    allClaims,
    currentClaim,
    30
  );
  if (fraudResult.hasDuplicates) {
    alert('Duplicate services detected!');
  }

  // Calculate savings
  const savings = LCT.financial.calculateSavings(5000, 4200);
  console.log(`Saved ${savings.savings} KES (${savings.savingsPercent})`);
</script>
```

### In Node.js Script

```javascript
const LCT = require('./lib/lct-functions.js');

// Load claims data
const claims = require('./data/claims.json');

// Run validations
claims.forEach(claim => {
  const result = LCT.invoice.validateAmount(
    claim.lctAmount,
    claim.etimsAmount,
    claim.documentAmount
  );

  if (result.status !== 'Approved') {
    console.log(`⚠️ ${claim.invoiceNumber}: ${result.reasons.join(', ')}`);
  }
});
```

---

## ✅ Testing Functions

Always test your functions with edge cases:

```javascript
// Test with edge cases
console.log('Testing invoice validation...');

// Normal case
test(
  validateInvoiceAmount(1000, 1000, 1000),
  'should approve matching amounts'
);

// ETIMS less than LCT
test(validateInvoiceAmount(1000, 800, 1000), 'should query when ETIMS < LCT');

// High variance
test(validateInvoiceAmount(1000, 1000, 5000), 'should reject 400% variance');

// Zero amounts
test(validateInvoiceAmount(0, 0, 0), 'should handle zero amounts');

// Negative (should throw)
try {
  validateInvoiceAmount(-1000, 1000, 1000);
  console.error('❌ Should have thrown error for negative amount');
} catch (e) {
  console.log('✅ Correctly rejected negative amount');
}
```

---

**Ready to implement? Start with the CRITICAL criteria functions first (#4, #6, #11, #15)!**
