const INDIAN_SUFFIXES = [
    { threshold: 1e7, suffix: "Cr" },
    { threshold: 1e5, suffix: "L" },
    { threshold: 1e3, suffix: "K" }
];

const COLORS = {
    zero: "rgba(10, 10, 10, 0.12)",
    low: "rgba(34, 197, 94, 0.8)",
    medium: "rgba(245, 158, 11, 0.8)",
    high: "rgba(217, 119, 87, 0.9)",
    veryHigh: "rgba(217, 119, 87, 0.65)",
    rejected: "rgba(220, 38, 38, 0.85)"
};

const KPI_CONFIG = [
    {
        key: "totalVisits",
        label: "Total Visits",
        caption: "Unique visits post-deduplication",
        icon: "🩺",
        compute: (metrics) => metrics.deduplicated.length,
        formatter: (value) => value.toLocaleString("en-IN"),
        trendFn: () => "neutral"
    },
    {
        key: "totalInvoices",
        label: "Total Invoices",
        caption: "All uploaded invoices before dedupe",
        icon: "📄",
        compute: (metrics) => metrics.enhancedClaims.length,
        formatter: (value) => value.toLocaleString("en-IN"),
        trendFn: () => "neutral"
    },
    {
        key: "totalRequested",
        label: "Total Requested",
        caption: "Sum of requested amounts",
        icon: "💰",
        compute: (metrics) => metrics.totals.totalRequested,
        formatter: formatIndianAmount,
        trendFn: () => "neutral"
    },
    {
        key: "totalAllowed",
        label: "Total Allowed",
        caption: "Approved by verification",
        icon: "✅",
        compute: (metrics) => metrics.totals.totalAllowed,
        formatter: formatIndianAmount,
        trendFn: () => "neutral"
    },
    {
        key: "totalSavings",
        label: "Total Savings",
        caption: "Requested minus allowed",
        icon: "💡",
        compute: (metrics) => metrics.totals.totalSavings,
        formatter: formatIndianAmount,
        trendFn: () => (metrics.totals.totalSavings >= 0 ? "up" : "down")
    },
    {
        key: "extractionRate",
        label: "Extraction Rate",
        caption: "AI extraction success",
        icon: "🤖",
        compute: (metrics) => metrics.extractionRate,
        formatter: (value) => formatPercent(value),
        trendFn: (metrics) => (metrics.extractionRate >= 80 ? "up" : "down")
    },
    {
        key: "adjudicationRate",
        label: "Adjudication Rate",
        caption: "Extracted claims adjudicated",
        icon: "⚖️",
        compute: (metrics) => metrics.adjudicationRate,
        formatter: (value) => formatPercent(value),
        trendFn: (metrics) => (metrics.adjudicationRate >= 80 ? "up" : "down")
    }
];

const CLAIMS_DATA = [
    {
        visitNumber: "1436695",
        invoiceNumber: "",
        patientName: "MAROA FRED KIRIGA",
        totalRequestAmt: 20910,
        totalExtractedAmt: 0,
        totalAllowedByVT: 20910,
        finalPayable: 20910,
        totalSavings: 0,
        savingsPercent: 0,
        claimId: 27042,
        createdAt: "2025-10-06T05:16:11Z",
        claimNumber: "D1436695-ktrhop252622503",
        dataExtracted: "Yes",
        adjudicated: "Yes"
    },
    {
        visitNumber: "1436922",
        invoiceNumber: "OPK7R/0609460",
        patientName: "SHERLYNE NYANCHAMA",
        totalRequestAmt: 71600,
        totalExtractedAmt: 71600,
        totalAllowedByVT: 71500,
        finalPayable: 71500,
        totalSavings: 100,
        savingsPercent: 0.14,
        claimId: 27043,
        createdAt: "2025-10-06T06:47:08Z",
        claimNumber: "D1436922-opktr26004640",
        dataExtracted: "Yes",
        adjudicated: "Yes"
    },
    {
        visitNumber: "1437065",
        invoiceNumber: "",
        patientName: "DAWNY CHEMUTAI ALWALA",
        totalRequestAmt: 64500,
        totalExtractedAmt: 0,
        totalAllowedByVT: 64500,
        finalPayable: 64500,
        totalSavings: 0,
        savingsPercent: 0,
        claimId: 27044,
        createdAt: "2025-10-06T07:26:09Z",
        claimNumber: "D1437065-AHL3959",
        dataExtracted: "Yes",
        adjudicated: "Yes"
    },
    {
        visitNumber: "1437168",
        invoiceNumber: "",
        patientName: "CECILIAH ANYEGA",
        totalRequestAmt: 57210,
        totalExtractedAmt: 0,
        totalAllowedByVT: 57210,
        finalPayable: 57210,
        totalSavings: 0,
        savingsPercent: 0,
        claimId: 27045,
        createdAt: "2025-10-06T07:48:09Z",
        claimNumber: "D1437168-EQA0310026078",
        dataExtracted: "Yes",
        adjudicated: "Yes"
    },
    {
        visitNumber: "1437184",
        invoiceNumber: "ODPK/044829/25",
        patientName: "CARREN NYAKWARA",
        totalRequestAmt: 49200,
        totalExtractedAmt: 73870,
        totalAllowedByVT: 49200,
        finalPayable: 49200,
        totalSavings: 0,
        savingsPercent: 0,
        claimId: 27046,
        createdAt: "2025-10-06T07:51:09Z",
        claimNumber: "D1437184-ODPK04497425",
        dataExtracted: "Yes",
        adjudicated: "Yes"
    },
    {
        visitNumber: "1437184",
        invoiceNumber: "ODPK/044134/25",
        patientName: "CARREN NYAKWARA",
        totalRequestAmt: 49200,
        totalExtractedAmt: 30180,
        totalAllowedByVT: 49200,
        finalPayable: 49200,
        totalSavings: 0,
        savingsPercent: 0,
        claimId: 27046,
        createdAt: "2025-10-06T07:51:09Z",
        claimNumber: "D1437184-ODPK04497425",
        dataExtracted: "Yes",
        adjudicated: "Yes"
    },
    {
        visitNumber: "1437271",
        invoiceNumber: "",
        patientName: "DAVID KIBET MAIYO",
        totalRequestAmt: 120000,
        totalExtractedAmt: 0,
        totalAllowedByVT: 0,
        finalPayable: 0,
        totalSavings: 120000,
        savingsPercent: 100,
        claimId: 27047,
        createdAt: "2025-10-06T08:09:09Z",
        claimNumber: "D1437271-SL194489OP",
        dataExtracted: "No",
        adjudicated: "No"
    },
    {
        visitNumber: "1423119",
        invoiceNumber: "",
        patientName: "TAJI BUNDI",
        totalRequestAmt: 64550,
        totalExtractedAmt: 0,
        totalAllowedByVT: 42490,
        finalPayable: 42490,
        totalSavings: 22060,
        savingsPercent: 34.18,
        claimId: 27048,
        createdAt: "2025-10-06T08:13:08Z",
        claimNumber: "D1423119-BILL250725073623",
        dataExtracted: "Yes",
        adjudicated: "Yes"
    }
];

const UPLOAD_HISTORY = [
    {
        id: 42,
        filename: "claims_oct_14.xlsx",
        claimsCount: 18,
        uploadedBy: "John Doe",
        uploadedAt: "2025-10-14T08:15:00Z",
        status: "success"
    },
    {
        id: 41,
        filename: "claims_oct_13.xlsx",
        claimsCount: 16,
        uploadedBy: "Jane Smith",
        uploadedAt: "2025-10-13T18:10:00Z",
        status: "success"
    },
    {
        id: 40,
        filename: "claims_oct_12.xlsx",
        claimsCount: 15,
        uploadedBy: "David Otieno",
        uploadedAt: "2025-10-12T08:05:00Z",
        status: "success"
    }
];

const providerLookup = new Map([
    ["BILL", "Bill Healthcare"],
    ["ODPK", "Outpatient Pharmacy Kenya"],
    ["OSH", "Outspan Hospital"],
    ["EQA", "Equity Afia"],
    ["FHCE", "Family Health Care Enterprise"],
    ["SL", "Sarit Centre Laboratory"],
    ["KTRH", "Kenyatta Referral Hospital"],
    ["AHL", "Aga Khan Hospital Limuru"]
]);

function parseProvider(invoiceNumber, claimNumber) {
    const combined = invoiceNumber || claimNumber || "";
    const code = combined.split(/[/-]/)[0]?.replace(/[0-9]/g, "").trim().toUpperCase();
    if (!code) {
        return { providerCode: undefined, providerName: "Unknown Provider" };
    }
    return {
        providerCode: code,
        providerName: providerLookup.get(code) || `${code} Healthcare`
    };
}

function formatIndianAmount(amount) {
    const absAmount = Math.abs(amount);
    for (const rule of INDIAN_SUFFIXES) {
        if (absAmount >= rule.threshold) {
            return `${(amount / rule.threshold).toFixed(1)} ${rule.suffix}`;
        }
    }
    return amount.toLocaleString("en-IN");
}

function formatPercent(value, digits = 1) {
    return `${value.toFixed(digits)}%`;
}

function getDateRangeForPeriod(period) {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    switch (period) {
        case "today":
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case "yesterday":
            start.setDate(start.getDate() - 1);
            end.setDate(end.getDate() - 1);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case "thisWeek": {
            const day = start.getDay();
            const diff = start.getDate() - day + (day === 0 ? -6 : 1);
            start.setDate(diff);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case "lastWeek": {
            const day = start.getDay();
            const diff = start.getDate() - day - 6;
            start.setDate(diff);
            end.setDate(start.getDate() + 6);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        }
        case "thisMonth":
            start.setDate(1);
            start.setHours(0, 0, 0, 0);
            end.setHours(23, 59, 59, 999);
            break;
        case "lastMonth":
            start.setDate(0);
            start.setDate(1);
            start.setMonth(start.getMonth() - 1);
            start.setHours(0, 0, 0, 0);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
            break;
        case "all":
        case "custom":
        default:
            return null;
    }

    return { start, end };
}

function filterClaims(claims, period, customRange) {
    if (period === "all") {
        return claims;
    }
    if (period === "custom" && customRange) {
        const { start, end } = customRange;
        return claims.filter((claim) => {
            const date = new Date(claim.createdAt);
            return date >= start && date <= end;
        });
    }
    const range = getDateRangeForPeriod(period);
    if (!range) {
        return claims;
    }
    return claims.filter((claim) => {
        const date = new Date(claim.createdAt);
        return date >= range.start && date <= range.end;
    });
}

function enhanceClaims(rawClaims) {
    return rawClaims.map((claim) => {
        const provider = parseProvider(claim.invoiceNumber, claim.claimNumber);
        const variance = claim.totalRequestAmt > 0
            ? Math.abs(claim.totalExtractedAmt - claim.totalRequestAmt) / claim.totalRequestAmt
            : 0;
        return {
            ...claim,
            ...provider,
            extractionVariance: variance,
            isFullyRejected: claim.savingsPercent === 100,
            isHighVariance: variance > 0.1
        };
    });
}

function deduplicateByVisit(claims) {
    const visits = new Map();
    claims.forEach((claim) => {
        if (!visits.has(claim.visitNumber)) {
            visits.set(claim.visitNumber, []);
        }
        visits.get(claim.visitNumber).push(claim);
    });

    const deduped = [];
    visits.forEach((list) => {
        if (list.length === 1) {
            deduped.push({
                ...list[0],
                invoiceCount: 1,
                originalInvoices: list.map((c) => c.invoiceNumber).filter(Boolean),
                isConsolidated: false
            });
            return;
        }

        const aggregated = list.reduce((acc, current) => ({
            ...acc,
            totalRequestAmt: acc.totalRequestAmt + current.totalRequestAmt,
            totalExtractedAmt: acc.totalExtractedAmt + current.totalExtractedAmt,
            totalAllowedByVT: acc.totalAllowedByVT + current.totalAllowedByVT,
            finalPayable: acc.finalPayable + current.finalPayable,
            totalSavings: acc.totalSavings + current.totalSavings
        }), {
            ...list[0],
            totalRequestAmt: 0,
            totalExtractedAmt: 0,
            totalAllowedByVT: 0,
            finalPayable: 0,
            totalSavings: 0
        });

        aggregated.savingsPercent = aggregated.totalRequestAmt > 0
            ? (aggregated.totalSavings / aggregated.totalRequestAmt) * 100
            : 0;
        aggregated.invoiceCount = list.length;
        aggregated.originalInvoices = list.map((c) => c.invoiceNumber).filter(Boolean);
        aggregated.isConsolidated = true;

        deduped.push(aggregated);
    });

    return deduped;
}

function calculateMetrics(rawClaims) {
    const enhancedClaims = enhanceClaims(rawClaims);
    const deduplicated = deduplicateByVisit(enhancedClaims);

    const totals = deduplicated.reduce((acc, claim) => {
        acc.totalRequested += claim.totalRequestAmt;
        acc.totalExtracted += claim.totalExtractedAmt;
        acc.totalAllowed += claim.totalAllowedByVT;
        acc.totalSavings += claim.totalSavings;
        if (claim.isFullyRejected) {
            acc.fullyRejected += 1;
        }
        if (claim.isHighVariance) {
            acc.highVariance += 1;
        }
        return acc;
    }, {
        totalRequested: 0,
        totalExtracted: 0,
        totalAllowed: 0,
        totalSavings: 0,
        fullyRejected: 0,
        highVariance: 0
    });

    const successfulExtractions = enhancedClaims.filter((claim) => claim.dataExtracted === "Yes").length;
    const adjudicated = enhancedClaims.filter((claim) => claim.dataExtracted === "Yes" && claim.adjudicated === "Yes").length;
    const failedExtractions = enhancedClaims.length - successfulExtractions;
    const pendingAdjudication = enhancedClaims.filter((claim) => claim.dataExtracted === "Yes" && claim.adjudicated === "No").length;

    const extractionRate = enhancedClaims.length > 0
        ? (successfulExtractions / enhancedClaims.length) * 100
        : 0;

    const adjudicationRate = successfulExtractions > 0
        ? (adjudicated / successfulExtractions) * 100
        : 0;

    const savingsDistribution = {
        zeroSavings: 0,
        low: 0,
        medium: 0,
        high: 0,
        veryHigh: 0,
        rejected: 0
    };

    deduplicated.forEach((claim) => {
        if (claim.savingsPercent === 0) {
            savingsDistribution.zeroSavings += 1;
        } else if (claim.savingsPercent === 100) {
            savingsDistribution.rejected += 1;
        } else if (claim.savingsPercent < 10) {
            savingsDistribution.low += 1;
        } else if (claim.savingsPercent < 20) {
            savingsDistribution.medium += 1;
        } else if (claim.savingsPercent < 50) {
            savingsDistribution.high += 1;
        } else {
            savingsDistribution.veryHigh += 1;
        }
    });

    const providerStatsMap = new Map();
    deduplicated.forEach((claim) => {
        if (!claim.providerCode) {
            return;
        }
        if (!providerStatsMap.has(claim.providerCode)) {
            providerStatsMap.set(claim.providerCode, {
                providerCode: claim.providerCode,
                providerName: claim.providerName || "Unknown Provider",
                visitCount: 0,
                invoiceCount: 0,
                totalRequested: 0,
                totalAllowed: 0,
                totalSavings: 0,
                fullyRejectedCount: 0
            });
        }
        const entry = providerStatsMap.get(claim.providerCode);
        entry.visitCount += 1;
        entry.invoiceCount += claim.invoiceCount || 1;
        entry.totalRequested += claim.totalRequestAmt;
        entry.totalAllowed += claim.totalAllowedByVT;
        entry.totalSavings += claim.totalSavings;
        if (claim.isFullyRejected) {
            entry.fullyRejectedCount += 1;
        }
    });

    const providerStats = Array.from(providerStatsMap.values()).map((stat) => {
        const relatedClaims = enhancedClaims.filter((claim) => claim.providerCode === stat.providerCode);
        const extracted = relatedClaims.filter((claim) => claim.dataExtracted === "Yes").length;
        const adjudicatedCount = relatedClaims.filter((claim) => claim.dataExtracted === "Yes" && claim.adjudicated === "Yes").length;

        return {
            ...stat,
            claimCount: relatedClaims.length,
            avgSavingsPercent: stat.totalRequested > 0 ? (stat.totalSavings / stat.totalRequested) * 100 : 0,
            extractionSuccessRate: relatedClaims.length > 0 ? (extracted / relatedClaims.length) * 100 : 0,
            adjudicationRate: extracted > 0 ? (adjudicatedCount / extracted) * 100 : 0,
            rejectionRate: stat.visitCount > 0 ? (stat.fullyRejectedCount / stat.visitCount) * 100 : 0
        };
    });

    const alerts = [];
    const duplicateVisits = enhancedClaims.length - deduplicated.length;

    if (duplicateVisits > 0) {
        alerts.push({
            id: "duplicate",
            severity: "medium",
            message: `Found ${duplicateVisits} visits with multiple invoices. Using consolidated view for accurate totals.`
        });
    }

    const rejectionRate = deduplicated.length > 0 ? (totals.fullyRejected / deduplicated.length) * 100 : 0;
    if (rejectionRate > 30) {
        alerts.push({
            id: "rejection",
            severity: "high",
            message: `${rejectionRate.toFixed(1)}% of claims are fully rejected. This may indicate billing issues.`
        });
    }

    if (extractionRate < 80) {
        alerts.push({
            id: "extraction",
            severity: extractionRate < 60 ? "high" : "medium",
            message: `${failedExtractions} claims failed AI extraction (${(100 - extractionRate).toFixed(1)}% failure rate).`
        });
    }

    if (pendingAdjudication > 0) {
        alerts.push({
            id: "pending",
            severity: pendingAdjudication > 10 ? "medium" : "low",
            message: `${pendingAdjudication} claims extracted but not yet adjudicated.`
        });
    }

    if (totals.highVariance > 0) {
        alerts.push({
            id: "variance",
            severity: "medium",
            message: `${totals.highVariance} claims have >10% variance between requested and extracted amounts.`
        });
    }

    return {
        totals,
        enhancedClaims,
        deduplicated,
        extractionRate,
        adjudicationRate,
        failedExtractions,
        pendingAdjudication,
        savingsDistribution,
        providerStats,
        alerts,
        duplicateVisits,
        fullyRejectedClaims: totals.fullyRejected,
        rejectionRate
    };
}

function renderKpis(metrics) {
    const grid = document.getElementById("kpi-grid");
    grid.innerHTML = KPI_CONFIG.map((config) => {
        const value = config.compute(metrics);
        const trend = config.trendFn(metrics);
        return `
            <article class="card metric-card">
                <header class="metric-label">
                    <span class="metric-icon" aria-hidden="true">${config.icon}</span>
                    <div class="metric-label-text">
                        <strong>${config.label}</strong>
                        ${config.caption ? `<span>${config.caption}</span>` : ""}
                    </div>
                </header>
                <strong class="metric-value">${config.formatter(value)}</strong>
                <div class="trend ${trend}">
                    ${trend === "up" ? "▲" : trend === "down" ? "▼" : "■"}
                    <span>${trend === "neutral" ? "Stable" : trend === "up" ? "Trending Up" : "Trending Down"}</span>
                </div>
            </article>
        `;
    }).join("");
}

function renderProgressRings(metrics) {
    const extractionRing = document.getElementById("extraction-ring");
    const adjudicationRing = document.getElementById("adjudication-ring");

    extractionRing.style.setProperty("--value", metrics.extractionRate);
    extractionRing.setAttribute("data-label", formatPercent(metrics.extractionRate));

    adjudicationRing.style.setProperty("--value", metrics.adjudicationRate);
    adjudicationRing.setAttribute("data-label", formatPercent(metrics.adjudicationRate));

    document.getElementById("failed-extractions").textContent = metrics.failedExtractions.toLocaleString("en-IN");
    document.getElementById("pending-adjudication").textContent = metrics.pendingAdjudication.toLocaleString("en-IN");
}

function renderSavingsDistribution(metrics) {
    const donut = document.getElementById("savings-donut");
    const legend = document.getElementById("savings-legend");

    const total = Object.values(metrics.savingsDistribution).reduce((acc, value) => acc + value, 0) || 1;
    const slices = [
        { key: "zeroSavings", label: "No Savings (0%)", color: COLORS.zero },
        { key: "low", label: "Low (1-10%)", color: COLORS.low },
        { key: "medium", label: "Moderate (10-20%)", color: COLORS.medium },
        { key: "high", label: "High (20-50%)", color: COLORS.high },
        { key: "veryHigh", label: "Very High (50-100%)", color: COLORS.veryHigh },
        { key: "rejected", label: "Fully Rejected (100%)", color: COLORS.rejected }
    ];

    let currentAngle = 0;
    const gradientParts = slices.map((slice) => {
        const value = metrics.savingsDistribution[slice.key] || 0;
        const start = currentAngle;
        currentAngle += (value / total) * 360;
        return `${slice.color} ${start.toFixed(2)}deg ${currentAngle.toFixed(2)}deg`;
    });
    donut.style.setProperty("--donut-fill", `conic-gradient(${gradientParts.join(", ")})`);

    legend.innerHTML = slices.map((slice) => `
        <div class="legend-item">
            <div style="display:flex; align-items:center; gap: var(--spacing-2);">
                <span class="legend-color" style="background:${slice.color};"></span>
                <span>${slice.label}</span>
            </div>
            <strong>${metrics.savingsDistribution[slice.key]}</strong>
        </div>
    `).join("");
}

function renderProviderPerformance(metrics) {
    const container = document.getElementById("provider-performance");
    const stats = metrics.providerStats;

    if (!stats.length) {
        container.innerHTML = "<p class=\"subtle-text\">No provider data available for the selected period.</p>";
        return;
    }

    const topByVolume = [...stats].sort((a, b) => b.visitCount - a.visitCount).slice(0, 10);
    const topBySavings = [...stats].sort((a, b) => b.totalSavings - a.totalSavings).slice(0, 10);
    const topByRejection = [...stats]
        .filter((item) => item.visitCount >= 3)
        .sort((a, b) => b.rejectionRate - a.rejectionRate)
        .slice(0, 10);

    container.innerHTML = `
        <section class="provider-chart">
            <h3 class="subtle-text" style="text-transform: uppercase;">Top Providers by Volume</h3>
            <div class="bar-list">
                ${renderBarList(topByVolume, "visitCount", " visits")}
            </div>
        </section>
        <section class="provider-chart">
            <h3 class="subtle-text" style="text-transform: uppercase;">Top Providers by Savings</h3>
            <div class="bar-list">
                ${renderBarList(topBySavings, "totalSavings", "", (value) => formatIndianAmount(value))}
            </div>
        </section>
        <section class="provider-chart">
            <h3 class="subtle-text" style="text-transform: uppercase;">Top Providers by Rejection Rate</h3>
            <div class="bar-list">
                ${renderBarList(topByRejection, "rejectionRate", "%", (value) => value.toFixed(1))}
            </div>
        </section>
    `;
}

function renderBarList(items, field, suffix = "", formatter = (value) => value) {
    if (!items.length) {
        return "<p class=\"subtle-text\">No data</p>";
    }
    const maxValue = Math.max(...items.map((item) => item[field])) || 1;
    return items.map((item) => {
        const percent = (item[field] / maxValue) * 100;
        return `
            <div class="bar-item">
                <div style="display:flex; flex-direction:column;">
                    <strong>${item.providerName}</strong>
                    <span class="subtle-text">${formatter(item[field])}${suffix}</span>
                </div>
                <div class="bar-track" aria-hidden="true">
                    <div class="bar-fill" style="width:${percent}%;"></div>
                </div>
            </div>
        `;
    }).join("");
}

function renderAlerts(metrics) {
    const container = document.getElementById("alerts-panel");
    if (!metrics.alerts.length) {
        container.innerHTML = `
            <div class="alert-row" role="status">
                <div class="alert-icon" style="background:rgba(34,197,94,0.15); color:var(--success);">✔</div>
                <div>
                    <div class="alert-severity low">Healthy</div>
                    <p>No quality issues detected for the selected period.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = metrics.alerts.map((alert) => `
        <div class="alert-row">
            <div class="alert-icon" style="background:${alert.severity === "high" ? "rgba(220,38,38,0.2)" : alert.severity === "medium" ? "rgba(245,158,11,0.2)" : "rgba(115,115,115,0.15)"};">
                ${alert.severity === "high" ? "!" : alert.severity === "medium" ? "⚠" : "ℹ"}
            </div>
            <div>
                <div class="alert-severity ${alert.severity}">${alert.severity.toUpperCase()}</div>
                <p>${alert.message}</p>
            </div>
        </div>
    `).join("");
}

function renderClaimsTable(metrics, state) {
    const tbody = document.getElementById("claims-table-body");
    const searchTerm = state.search.toLowerCase();

    const sortedClaims = [...metrics.deduplicated].sort((a, b) => {
        const key = state.sortKey;
        if (!key) {
            return 0;
        }
        const direction = state.sortDirection === "asc" ? 1 : -1;
        const valueA = a[key];
        const valueB = b[key];
        if (typeof valueA === "number" && typeof valueB === "number") {
            return (valueA - valueB) * direction;
        }
        return valueA.toString().localeCompare(valueB.toString()) * direction;
    });

    const filtered = sortedClaims.filter((claim) => {
        if (!searchTerm) {
            return true;
        }
        return [
            claim.visitNumber,
            claim.invoiceNumber,
            claim.patientName,
            claim.providerName
        ].some((field) => field && field.toLowerCase().includes(searchTerm));
    });

    const pageCount = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    if (state.page > pageCount) {
        state.page = pageCount;
    }

    const start = (state.page - 1) * state.pageSize;
    const pageItems = filtered.slice(start, start + state.pageSize);

    tbody.innerHTML = pageItems.map((claim) => `
        <tr>
            <td>${claim.visitNumber}</td>
            <td>${claim.invoiceNumber || "—"}</td>
            <td>${claim.patientName}</td>
            <td>${claim.providerName || "Unknown Provider"}</td>
            <td class="text-right">${formatIndianAmount(claim.totalRequestAmt)}</td>
            <td class="text-right">${formatIndianAmount(claim.totalAllowedByVT)}</td>
            <td class="text-right">${formatIndianAmount(claim.totalSavings)}</td>
            <td class="text-right">
                <span class="badge ${claim.savingsPercent >= 20 ? "success" : "neutral"}">${claim.savingsPercent.toFixed(1)}%</span>
            </td>
            <td>${renderStatusBadge(claim.dataExtracted === "Yes", "extraction")}</td>
            <td>${renderStatusBadge(claim.adjudicated === "Yes", "adjudication")}</td>
            <td>${renderClaimStatus(claim)}</td>
            <td>${new Date(claim.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
        </tr>
    `).join("");

    document.getElementById("claims-count-summary").textContent = `Showing ${pageItems.length} of ${filtered.length} claims`;
    document.getElementById("pagination-label").textContent = `Page ${state.page} of ${pageCount}`;
    document.getElementById("prev-page").disabled = state.page === 1;
    document.getElementById("next-page").disabled = state.page === pageCount;
}

function renderStatusBadge(isYes, type) {
    if (isYes) {
        return `<span class="badge success">Yes</span>`;
    }
    return type === "adjudication"
        ? `<span class="badge warning">Pending</span>`
        : `<span class="badge error">No</span>`;
}

function renderClaimStatus(claim) {
    if (claim.isFullyRejected) {
        return `<span class="badge error">Fully Rejected</span>`;
    }
    if (claim.isHighVariance) {
        return `<span class="badge warning">High Variance</span>`;
    }
    return `<span class="badge neutral">Normal</span>`;
}

function renderUploadHistory(history) {
    const tbody = document.getElementById("upload-history-tbody");
    const emptyState = document.getElementById("history-empty-state");
    if (!history.length) {
        emptyState.hidden = false;
        tbody.innerHTML = "";
        return;
    }

    emptyState.hidden = true;
    tbody.innerHTML = history.map((entry) => `
        <tr>
            <td>${new Date(entry.uploadedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
            <td>${entry.uploadedBy}</td>
            <td>${entry.filename}</td>
            <td class="text-right">${entry.claimsCount.toLocaleString("en-IN")}</td>
            <td><span class="badge ${entry.status === "success" ? "success" : "error"}" style="text-transform:capitalize;">${entry.status || "unknown"}</span></td>
        </tr>
    `).join("");
}

function initTabs(state) {
    const tabs = document.querySelectorAll(".tab-button");
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((btn) => {
                btn.classList.toggle("is-active", btn === tab);
                btn.setAttribute("aria-selected", btn === tab ? "true" : "false");
            });

            document.querySelectorAll(".tab-panel").forEach((panel) => {
                const isMatch = panel.id === `${tab.dataset.tab}-tab`;
                panel.hidden = !isMatch;
            });
            state.activeTab = tab.dataset.tab;
        });
    });
}

function initSorting(state) {
    const headers = document.querySelectorAll("th[data-sort-key]");
    headers.forEach((header) => {
        header.addEventListener("click", () => {
            const key = header.dataset.sortKey;
            if (state.sortKey === key) {
                state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
            } else {
                state.sortKey = key;
                state.sortDirection = "asc";
            }
            if (state.currentMetrics) {
                renderClaimsTable(state.currentMetrics, state);
            }
        });
    });
}

function initSearch(state) {
    const input = document.getElementById("claim-search");
    input.addEventListener("input", (event) => {
        state.search = event.target.value;
        state.page = 1;
        if (state.currentMetrics) {
            renderClaimsTable(state.currentMetrics, state);
        }
    });
}

function initPagination(state) {
    document.getElementById("prev-page").addEventListener("click", () => {
        if (state.page > 1) {
            state.page -= 1;
            if (state.currentMetrics) {
                renderClaimsTable(state.currentMetrics, state);
            }
        }
    });

    document.getElementById("next-page").addEventListener("click", () => {
        if (!state.currentMetrics) {
            return;
        }
        const total = state.currentMetrics.deduplicated.length;
        const maxPage = Math.ceil(total / state.pageSize);
        if (state.page < maxPage) {
            state.page += 1;
            renderClaimsTable(state.currentMetrics, state);
        }
    });
}

function initExport(state) {
    document.getElementById("export-btn").addEventListener("click", () => {
        if (!state.currentMetrics) {
            return;
        }
        const headers = [
            "visitNumber",
            "invoiceNumber",
            "patientName",
            "providerName",
            "totalRequestAmt",
            "totalAllowedByVT",
            "totalSavings",
            "savingsPercent",
            "dataExtracted",
            "adjudicated",
            "createdAt"
        ];

        const rows = state.currentMetrics.deduplicated.map((claim) => headers.map((key) => claim[key] ?? "").join(","));
        const csvContent = [headers.join(","), ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `claims_export_${Date.now()}.csv`);
        link.click();
        URL.revokeObjectURL(url);
    });
}

function initDateFilter(state, allClaims, historyState) {
    const periodSelect = document.getElementById("period-select");
    const customRangeEl = document.getElementById("custom-range");
    const fromDate = document.getElementById("from-date");
    const toDate = document.getElementById("to-date");
    const applyButton = document.getElementById("apply-range");
    const lastUpdatedLabel = document.getElementById("last-updated-label");

    const refresh = (period, customRange = null) => {
        state.period = period;
        state.customRange = customRange;
        const filteredClaims = filterClaims(allClaims, period, customRange);
        const metrics = calculateMetrics(filteredClaims);
        updateDashboard(metrics, state, historyState);
        const lastUpdated = new Date();
        lastUpdatedLabel.textContent = lastUpdated.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    periodSelect.addEventListener("change", (event) => {
        const value = event.target.value;
        if (value === "custom") {
            customRangeEl.hidden = false;
        } else {
            customRangeEl.hidden = true;
            refresh(value);
        }
    });

    applyButton.addEventListener("click", () => {
        if (!fromDate.value || !toDate.value) {
            alert("Please select both From and To dates.");
            return;
        }
        const start = new Date(fromDate.value);
        const end = new Date(toDate.value);
        if (end < start) {
            alert("To date must be after From date.");
            return;
        }
        end.setHours(23, 59, 59, 999);
        refresh("custom", { start, end });
    });

    refresh(state.period);
}

function initUploadModal(historyState) {
    const modal = document.getElementById("upload-modal");
    const openButtons = document.querySelectorAll("#open-upload-modal, button[data-trigger-upload]");
    const closeButton = modal.querySelector(".modal-close");
    const cancelButton = document.getElementById("cancel-upload");
    const startButton = document.getElementById("start-upload");
    const browseButton = document.getElementById("browse-btn");
    const fileInput = document.getElementById("file-input");
    const dropZone = document.getElementById("drop-zone");
    const progress = document.getElementById("upload-progress");
    const progressLabel = document.getElementById("progress-label");
    const summary = document.getElementById("upload-summary");

    let uploadFile = null;
    let intervalId = null;

    const reset = () => {
        uploadFile = null;
        startButton.disabled = true;
        progress.style.width = "0";
        progressLabel.textContent = "Waiting for file";
        summary.hidden = true;
        summary.innerHTML = "";
        dropZone.classList.remove("is-dragging");
    };

    const close = () => {
        modal.classList.remove("is-visible");
        reset();
    };

    openButtons.forEach((btn) => btn.addEventListener("click", () => modal.classList.add("is-visible")));
    closeButton.addEventListener("click", close);
    cancelButton.addEventListener("click", close);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            close();
        }
    });

    function handleFile(file) {
        if (!file.name.match(/\.(xlsx|xls)$/i)) {
            alert("Please upload an Excel file (.xlsx or .xls).");
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            alert("File must be 20MB or smaller.");
            return;
        }
        uploadFile = file;
        startButton.disabled = false;
        progressLabel.textContent = `Ready to upload ${file.name}`;
    }

    browseButton.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", (event) => {
        const file = event.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    });

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropZone.classList.add("is-dragging");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("is-dragging");
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        dropZone.classList.remove("is-dragging");
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleFile(file);
        }
    });

    startButton.addEventListener("click", () => {
        if (!uploadFile) {
            return;
        }
        startButton.disabled = true;
        let progressValue = 0;
        progressLabel.textContent = "Uploading…";
        intervalId = setInterval(() => {
            progressValue += Math.random() * 20;
            if (progressValue >= 100) {
                progressValue = 100;
                clearInterval(intervalId);
                progressLabel.textContent = "Processing complete.";
                summary.hidden = false;
                summary.innerHTML = `
                    <h4 style="font-weight: var(--font-semibold); margin-bottom: var(--spacing-2);">Upload successful</h4>
                    <p class="subtle-text">${uploadFile.name}</p>
                    <div style="display: grid; gap: var(--spacing-2); margin-top: var(--spacing-3);">
                        <div><strong>Claims processed:</strong> ${Math.floor(Math.random() * 30) + 12}</div>
                        <div><strong>Total savings:</strong> ${formatIndianAmount(Math.floor(Math.random() * 6e6))}</div>
                    </div>
                `;
                historyState.unshift({
                    id: Date.now(),
                    filename: uploadFile.name,
                    claimsCount: Math.floor(Math.random() * 30) + 12,
                    uploadedBy: "Current User",
                    uploadedAt: new Date().toISOString(),
                    status: "success"
                });
                renderUploadHistory(historyState);
                startButton.disabled = false;
            }
            progress.style.width = `${progressValue}%`;
        }, 280);
    });
}

function updateDashboard(metrics, state, historyState) {
    state.currentMetrics = metrics;
    renderKpis(metrics);
    renderProgressRings(metrics);
    renderSavingsDistribution(metrics);
    renderProviderPerformance(metrics);
    renderAlerts(metrics);
    renderClaimsTable(metrics, state);
    renderUploadHistory(historyState);
}

function initDashboard() {
    const state = {
        period: "thisWeek",
        customRange: null,
        activeTab: "overview",
        sortKey: "",
        sortDirection: "asc",
        search: "",
        page: 1,
        pageSize: 20,
        currentMetrics: null
    };

    const historyState = [...UPLOAD_HISTORY];

    initTabs(state);
    initSorting(state);
    initSearch(state);
    initPagination(state);
    initExport(state);
    initDateFilter(state, CLAIMS_DATA, historyState);
    initUploadModal(historyState);
}

document.addEventListener("DOMContentLoaded", initDashboard);
