# Building Tools for LCT commit

**Last Updated:** October 11, 2025

---

## 🎯 Overview

This guide explains how to build custom tools and integrations for the LCT commit project.

---

## 🛠️ Types of Tools You Can Build

### 1. Custom MCP Servers (Claude Desktop Integration)

### 2. Project Utilities (Scripts & Helpers)

### 3. Web Components (UI Features)

### 4. API Integrations (External Services)

---

## 🔧 1. Custom MCP Servers

Build specialized MCP servers that Claude Code can use when working on LCT commit.

### Use Cases for LCT commit

**LCT Claims Database Server:**

- Query claims data directly
- Validate invoice amounts against tariff database
- Check for duplicate services across providers
- Generate savings reports by scheme

**ETIMS Integration Server:**

- Verify invoice amounts against Kenya tax system
- Validate provider tax compliance
- Cross-reference billing data

**Healthcare Fraud Detection Server:**

- Run fraud detection algorithms
- Pattern analysis for repeated services
- Cross-provider duplicate detection
- Anomaly scoring

### How to Build a Custom MCP Server

#### Option A: Using MCP SDK (TypeScript/JavaScript)

```bash
# 1. Create a new MCP server project
cd ~/projects
npx @modelcontextprotocol/create-server lct-claims-mcp

# 2. Directory structure
lct-claims-mcp/
├── src/
│   ├── index.ts          # Main server entry
│   ├── tools/            # Tool implementations
│   │   ├── queryClaims.ts
│   │   ├── validateInvoice.ts
│   │   └── detectFraud.ts
│   └── resources/        # Data resources
├── package.json
└── tsconfig.json
```

#### Example: LCT Claims MCP Server

**src/index.ts:**

```typescript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Database connection (example using pg)
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.LCT_DATABASE_URL,
});

// Create server instance
const server = new Server(
  {
    name: 'lct-claims-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'query_claims',
        description: 'Query claims from LCT database with filters',
        inputSchema: {
          type: 'object',
          properties: {
            scheme: {
              type: 'string',
              description: 'Scheme name (e.g., MTRH)',
            },
            status: {
              type: 'string',
              enum: ['approved', 'rejected', 'pending', 'query'],
              description: 'Claim vetting status',
            },
            dateFrom: {
              type: 'string',
              description: 'Start date (ISO 8601)',
            },
            dateTo: {
              type: 'string',
              description: 'End date (ISO 8601)',
            },
            limit: {
              type: 'number',
              description: 'Max results to return',
              default: 100,
            },
          },
        },
      },
      {
        name: 'validate_invoice',
        description: 'Validate invoice amount against LCT precedence rules',
        inputSchema: {
          type: 'object',
          properties: {
            lctAmount: {
              type: 'number',
              description: 'Amount in LCT system',
            },
            etimsAmount: {
              type: 'number',
              description: 'Amount in ETIMS tax system',
            },
            documentAmount: {
              type: 'number',
              description: 'Amount on physical document',
            },
          },
          required: ['lctAmount', 'etimsAmount', 'documentAmount'],
        },
      },
      {
        name: 'detect_duplicate_services',
        description:
          'Check for duplicate services across providers (Criteria #15)',
        inputSchema: {
          type: 'object',
          properties: {
            memberId: {
              type: 'string',
              description: 'Member/patient ID',
            },
            serviceCode: {
              type: 'string',
              description: 'Service code (e.g., LAB001)',
            },
            dateRange: {
              type: 'number',
              description: 'Days to look back',
              default: 30,
            },
          },
          required: ['memberId', 'serviceCode'],
        },
      },
      {
        name: 'calculate_savings',
        description: 'Calculate savings for a claim or scheme',
        inputSchema: {
          type: 'object',
          properties: {
            claimId: {
              type: 'string',
              description: 'Specific claim ID (optional)',
            },
            scheme: {
              type: 'string',
              description: 'Scheme name (optional)',
            },
            period: {
              type: 'string',
              description: 'Time period: week, month, year',
            },
          },
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'query_claims': {
        const { scheme, status, dateFrom, dateTo, limit = 100 } = args;

        let query = `
          SELECT
            c.id,
            c.invoice_number,
            c.member_name,
            c.diagnosis_code,
            c.lct_amount,
            c.etims_amount,
            c.approved_amount,
            c.vetting_status,
            c.vetting_reason,
            c.provider,
            c.scheme,
            c.service_date
          FROM claims c
          WHERE 1=1
        `;

        const queryParams: any[] = [];
        let paramIndex = 1;

        if (scheme) {
          query += ` AND c.scheme = $${paramIndex}`;
          queryParams.push(scheme);
          paramIndex++;
        }

        if (status) {
          query += ` AND c.vetting_status = $${paramIndex}`;
          queryParams.push(status);
          paramIndex++;
        }

        if (dateFrom) {
          query += ` AND c.service_date >= $${paramIndex}`;
          queryParams.push(dateFrom);
          paramIndex++;
        }

        if (dateTo) {
          query += ` AND c.service_date <= $${paramIndex}`;
          queryParams.push(dateTo);
          paramIndex++;
        }

        query += ` ORDER BY c.service_date DESC LIMIT $${paramIndex}`;
        queryParams.push(limit);

        const result = await pool.query(query, queryParams);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.rows, null, 2),
            },
          ],
        };
      }

      case 'validate_invoice': {
        const { lctAmount, etimsAmount, documentAmount } = args;

        // Criteria #4 (CRITICAL): Invoice amount precedence
        // Priority: LCT → ETIMS → Document

        const approvedAmount = lctAmount; // LCT always takes precedence

        let status = 'Approved';
        let reason = '';

        // Check for discrepancies
        if (etimsAmount < lctAmount) {
          status = 'Query';
          reason = 'ETIMS amount less than LCT amount';
        }

        const variance = Math.abs(documentAmount - lctAmount) / lctAmount;
        if (variance > 0.1) {
          // More than 10% variance
          status = 'Query';
          reason = `High variance between LCT and document amounts (${(variance * 100).toFixed(1)}%)`;
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  status,
                  approvedAmount,
                  reason,
                  validation: {
                    lctAmount,
                    etimsAmount,
                    documentAmount,
                    variance: `${(variance * 100).toFixed(1)}%`,
                  },
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'detect_duplicate_services': {
        const { memberId, serviceCode, dateRange = 30 } = args;

        // Criteria #15 (CRITICAL): Cross-provider duplicate service detection
        const query = `
          SELECT
            c.invoice_number,
            c.provider,
            c.service_date,
            cs.service_code,
            cs.service_name,
            cs.amount
          FROM claims c
          JOIN claim_services cs ON c.id = cs.claim_id
          WHERE c.member_id = $1
            AND cs.service_code = $2
            AND c.service_date >= NOW() - INTERVAL '${dateRange} days'
          ORDER BY c.service_date DESC
        `;

        const result = await pool.query(query, [memberId, serviceCode]);

        const duplicates = result.rows.length > 1;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(
                {
                  isDuplicate: duplicates,
                  count: result.rows.length,
                  instances: result.rows,
                  flagReason: duplicates
                    ? `Service ${serviceCode} provided ${result.rows.length} times in ${dateRange} days`
                    : 'No duplicates detected',
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case 'calculate_savings': {
        const { claimId, scheme, period } = args;

        let query = `
          SELECT
            COUNT(*) as total_claims,
            SUM(c.lct_amount) as total_billed,
            SUM(c.approved_amount) as total_approved,
            SUM(c.lct_amount - c.approved_amount) as total_savings,
            ROUND(AVG((c.lct_amount - c.approved_amount) / c.lct_amount * 100), 2) as avg_savings_percent
          FROM claims c
          WHERE 1=1
        `;

        const queryParams: any[] = [];

        if (claimId) {
          query += ` AND c.id = $1`;
          queryParams.push(claimId);
        } else if (scheme) {
          query += ` AND c.scheme = $1`;
          queryParams.push(scheme);
        }

        const result = await pool.query(query, queryParams);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result.rows[0], null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('LCT Claims MCP server running on stdio');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

**package.json:**

```json
{
  "name": "lct-claims-mcp",
  "version": "1.0.0",
  "description": "MCP server for LCT commit healthcare claims",
  "type": "module",
  "bin": {
    "lct-claims-mcp": "./build/index.js"
  },
  "scripts": {
    "build": "tsc",
    "prepare": "npm run build"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/pg": "^8.10.0",
    "typescript": "^5.3.0"
  }
}
```

#### Build and Install

```bash
# 1. Build the server
npm install
npm run build

# 2. Install globally (optional)
npm link

# 3. Configure in Claude Desktop
# Edit: ~/Library/Application Support/Claude/claude_desktop_config.json
```

**claude_desktop_config.json:**

```json
{
  "mcpServers": {
    "lct-claims": {
      "command": "node",
      "args": ["/path/to/lct-claims-mcp/build/index.js"],
      "env": {
        "LCT_DATABASE_URL": "postgresql://user:pass@localhost:5432/lct_claims"
      }
    }
  }
}
```

#### Test Your MCP Server

```bash
# Test locally
node build/index.js

# In Claude Code, try:
# "Query claims from MTRH scheme with status approved"
# "Validate invoice with LCT amount 1700, ETIMS 1500, document 3370"
# "Check for duplicate services for member M123, service code LAB001"
```

---

## 🔨 2. Project Utilities (Scripts)

Build helper scripts for common LCT commit tasks.

### Example: Claims Data Generator

**scripts/generate-test-claims.js:**

```javascript
#!/usr/bin/env node

/**
 * Generate synthetic claims data for testing
 * Usage: node scripts/generate-test-claims.js --count 100
 */

const fs = require('fs');
const { faker } = require('@faker-js/faker');

function generateClaim(id) {
  const lctAmount = faker.number.int({ min: 500, max: 50000 });
  const etimsAmount = lctAmount * faker.number.float({ min: 0.9, max: 1.1 });
  const documentAmount = lctAmount * faker.number.float({ min: 0.8, max: 1.2 });

  return {
    id,
    invoiceNumber: `CB-${faker.number.int({ min: 100000, max: 999999 })}-25`,
    memberName: faker.person.fullName(),
    memberID: `M${faker.number.int({ min: 1000, max: 9999 })}`,
    diagnosisCode: faker.helpers.arrayElement([
      'B50',
      'J00',
      'K29',
      'M79',
      'R50',
    ]),
    diagnosisText: faker.helpers.arrayElement([
      'Malaria',
      'Acute Upper Respiratory Infection',
      'Gastritis',
      'Joint Pain',
      'Fever',
    ]),
    lctAmount,
    etimsAmount: Math.round(etimsAmount),
    documentAmount: Math.round(documentAmount),
    approvedAmount: null,
    services: generateServices(),
    serviceDate: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
    invoiceDate: faker.date.recent({ days: 90 }).toISOString().split('T')[0],
    provider: faker.helpers.arrayElement([
      'Bliss Healthcare',
      'MTRH',
      'Aga Khan Hospital',
      'Nairobi Hospital',
    ]),
    scheme: faker.helpers.arrayElement(['MTRH', 'NHIF', 'Liaison Group']),
    status: 'Not Started',
    vettingStatus: null,
    priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
  };
}

function generateServices() {
  const serviceCount = faker.number.int({ min: 1, max: 5 });
  const services = [];

  for (let i = 0; i < serviceCount; i++) {
    services.push({
      code: `SRV${faker.number.int({ min: 100, max: 999 })}`,
      name: faker.helpers.arrayElement([
        'Lab Test - Malaria',
        'Consultation',
        'Medication',
        'X-Ray',
        'Ultrasound',
      ]),
      amount: faker.number.int({ min: 100, max: 10000 }),
    });
  }

  return services;
}

// CLI
const args = process.argv.slice(2);
const countArg = args.find(arg => arg.startsWith('--count='));
const count = countArg ? parseInt(countArg.split('=')[1]) : 50;

const claims = Array.from({ length: count }, (_, i) => generateClaim(i + 1));

// Output
const outputFile = 'test-claims.json';
fs.writeFileSync(outputFile, JSON.stringify(claims, null, 2));

console.log(`✅ Generated ${count} test claims`);
console.log(`📄 Saved to: ${outputFile}`);
console.log(`\n📊 Sample claim:`);
console.log(JSON.stringify(claims[0], null, 2));
```

### Example: Criteria Checker

**scripts/check-criteria-compliance.js:**

```javascript
#!/usr/bin/env node

/**
 * Check if claims comply with the 31 success criteria
 * Usage: node scripts/check-criteria-compliance.js claims.json
 */

const fs = require('fs');

function checkCriteria4(claim) {
  // Criteria #4 (CRITICAL): Invoice amount precedence
  const approvedAmount = claim.lctAmount; // LCT takes precedence

  let issues = [];

  if (claim.etimsAmount < claim.lctAmount) {
    issues.push('ETIMS amount less than LCT amount - flag as Query');
  }

  const variance =
    Math.abs(claim.documentAmount - claim.lctAmount) / claim.lctAmount;
  if (variance > 0.1) {
    issues.push(
      `High variance (${(variance * 100).toFixed(1)}%) between LCT and document`
    );
  }

  return {
    criteriaId: 4,
    criteriaName: 'Invoice amount precedence',
    priority: 'CRITICAL',
    passed: issues.length === 0,
    issues,
  };
}

function checkCriteria11(claims, claimIndex) {
  // Criteria #11 (CRITICAL): Repeated service detection
  const claim = claims[claimIndex];
  const duplicates = [];

  for (let i = 0; i < claims.length; i++) {
    if (i === claimIndex) continue;

    if (claims[i].memberID === claim.memberID) {
      // Check for duplicate services
      claim.services.forEach(service => {
        claims[i].services.forEach(otherService => {
          if (service.code === otherService.code) {
            const daysDiff =
              Math.abs(
                new Date(claim.serviceDate) - new Date(claims[i].serviceDate)
              ) /
              (1000 * 60 * 60 * 24);

            if (daysDiff <= 7) {
              duplicates.push({
                service: service.name,
                provider1: claim.provider,
                provider2: claims[i].provider,
                daysDiff: Math.round(daysDiff),
              });
            }
          }
        });
      });
    }
  }

  return {
    criteriaId: 11,
    criteriaName: 'Repeated service detection',
    priority: 'CRITICAL',
    passed: duplicates.length === 0,
    duplicates,
  };
}

// Load claims
const claimsFile = process.argv[2] || 'test-claims.json';
const claims = JSON.parse(fs.readFileSync(claimsFile, 'utf8'));

console.log(
  `🔍 Checking ${claims.length} claims against success criteria...\n`
);

// Check each claim
const results = claims.map((claim, index) => {
  return {
    claimId: claim.id,
    invoiceNumber: claim.invoiceNumber,
    checks: [checkCriteria4(claim), checkCriteria11(claims, index)],
  };
});

// Summary
const totalChecks = results.length * 2; // 2 criteria per claim
const failedChecks = results.reduce((sum, r) => {
  return sum + r.checks.filter(c => !c.passed).length;
}, 0);

console.log(`\n📊 Summary:`);
console.log(`Total checks: ${totalChecks}`);
console.log(
  `Passed: ${totalChecks - failedChecks} (${(((totalChecks - failedChecks) / totalChecks) * 100).toFixed(1)}%)`
);
console.log(`Failed: ${failedChecks}`);

// Show failures
const failures = results.filter(r => r.checks.some(c => !c.passed));
if (failures.length > 0) {
  console.log(`\n❌ Failed Claims:`);
  failures.forEach(f => {
    console.log(`\n  Invoice: ${f.invoiceNumber}`);
    f.checks
      .filter(c => !c.passed)
      .forEach(check => {
        console.log(`    🔴 ${check.criteriaName} (${check.priority})`);
        if (check.issues) {
          check.issues.forEach(issue => console.log(`       - ${issue}`));
        }
        if (check.duplicates) {
          check.duplicates.forEach(dup => {
            console.log(
              `       - Duplicate ${dup.service} at ${dup.provider2} (${dup.daysDiff} days apart)`
            );
          });
        }
      });
  });
}

// Save report
const report = {
  timestamp: new Date().toISOString(),
  totalClaims: claims.length,
  totalChecks,
  passed: totalChecks - failedChecks,
  failed: failedChecks,
  passRate: `${(((totalChecks - failedChecks) / totalChecks) * 100).toFixed(1)}%`,
  failures,
};

fs.writeFileSync('compliance-report.json', JSON.stringify(report, null, 2));
console.log(`\n📄 Full report saved to: compliance-report.json`);
```

---

## 🌐 3. Web Components

Build reusable UI components for the HTML tracker.

### Example: Claims Chart Component

**components/claims-chart.js:**

```javascript
/**
 * Claims Volume Chart Component
 * Shows claims volume by week/month
 */

class ClaimsChart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set data(value) {
    this._data = value;
    this.render();
  }

  render() {
    if (!this._data) return;

    const maxValue = Math.max(...this._data.map(d => d.count));

    this.shadowRoot.innerHTML = `
      <style>
        .chart-container {
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 16px;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 200px;
          gap: 8px;
        }

        .bar {
          flex: 1;
          background: linear-gradient(to top, #3b82f6, #60a5fa);
          border-radius: 4px 4px 0 0;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .bar:hover {
          background: linear-gradient(to top, #2563eb, #3b82f6);
          transform: translateY(-4px);
        }

        .bar-label {
          position: absolute;
          bottom: -24px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
        }

        .bar-value {
          position: absolute;
          top: -24px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }
      </style>

      <div class="chart-container">
        <div class="chart-title">Claims Volume</div>
        <div class="chart-bars">
          ${this._data
            .map(
              item => `
            <div
              class="bar"
              style="height: ${(item.count / maxValue) * 100}%"
              title="${item.label}: ${item.count} claims"
            >
              <div class="bar-value">${item.count}</div>
              <div class="bar-label">${item.label}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }
}

customElements.define('claims-chart', ClaimsChart);
```

**Usage in HTML:**

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="components/claims-chart.js"></script>
  </head>
  <body>
    <claims-chart id="chart"></claims-chart>

    <script>
      // Set chart data
      document.getElementById('chart').data = [
        { label: 'Week 1', count: 847 },
        { label: 'Week 2', count: 923 },
        { label: 'Week 3', count: 1105 },
        { label: 'Week 4', count: 894 },
      ];
    </script>
  </body>
</html>
```

---

## 🔌 4. API Integrations

Build wrappers for external services.

### Example: ETIMS API Client

**lib/etims-client.js:**

```javascript
/**
 * ETIMS (Kenya eTax) API Client
 * For validating invoice amounts
 */

class EtimsClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.etims.go.ke/v1';
  }

  async validateInvoice(invoiceNumber) {
    try {
      const response = await fetch(
        `${this.baseUrl}/invoices/${invoiceNumber}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`ETIMS API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        invoice: {
          number: data.invoiceNumber,
          amount: data.totalAmount,
          taxAmount: data.taxAmount,
          date: data.invoiceDate,
          seller: data.sellerInfo,
          items: data.items,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getSellerInfo(sellerPIN) {
    try {
      const response = await fetch(`${this.baseUrl}/sellers/${sellerPIN}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ETIMS API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        seller: data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EtimsClient;
}
```

---

## 📦 Tool Organization

```
lct-commit/
├── mcp-servers/           # Custom MCP servers
│   ├── lct-claims/
│   └── etims-integration/
├── scripts/               # Utility scripts
│   ├── generate-test-claims.js
│   ├── check-criteria-compliance.js
│   └── export-reports.js
├── components/            # Web components
│   ├── claims-chart.js
│   ├── savings-widget.js
│   └── fraud-alerts.js
├── lib/                   # Shared libraries
│   ├── etims-client.js
│   ├── validators.js
│   └── calculations.js
└── tools/                 # CLI tools
    ├── claims-cli.js
    └── audit-tool.js
```

---

## 🚀 Getting Started

### 1. Start Small

Begin with simple utility scripts before building complex MCP servers.

### 2. Test Locally

Always test tools with sample data before using on real claims.

### 3. Document Well

Add clear README files for each tool explaining usage.

### 4. Version Control

Commit tools to the repository so the team can use them.

### 5. Security First

Never hardcode credentials - use environment variables.

---

## 💡 Tool Ideas for LCT commit

### High Priority

1. **Claims Validator** - Batch validate claims against 31 criteria
2. **Fraud Detector** - Run pattern analysis on claim history
3. **Report Generator** - Weekly/monthly savings reports
4. **Data Importer** - Import claims from Excel/CSV

### Medium Priority

5. **Tariff Updater** - Sync tariff database with latest prices
6. **Provider Dashboard** - Real-time stats for each provider
7. **Alert System** - Email/Slack alerts for critical issues
8. **Backup Tool** - Automated backups of localStorage data

### Nice to Have

9. **Performance Monitor** - Track system response times
10. **A/B Testing Tool** - Test different fraud detection algorithms
11. **Training Data Generator** - Create ML training datasets
12. **API Gateway** - Unified API for all LCT services

---

## 🆘 Need Help?

- **MCP SDK Docs:** https://modelcontextprotocol.io/docs
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/
- **Node.js API:** https://nodejs.org/docs/

---

**Remember:** Build tools that solve real problems for the 31 criteria. Start simple, iterate often!
