# Website Navigation and Architecture - LCT-Vitraya Healthcare Claims System

## Overview
This document describes the navigation flow and architecture for the LCT-Vitraya healthcare claims adjudication system. The website is designed to be beginner-friendly, secure, and focused on achieving 90%+ accuracy across 31 criteria. All components are static HTML/JS/CSS with lightweight Node.js APIs for simplicity and security.

- **Primary Goal**: Track and validate claims against 31 success criteria for pilot-to-commercial transition.
- **Tech Stack Summary**: Refer to `docs/TECH_STACK.md` for details.
- **Accessibility**: Follows WCAG 2.2; all agents can access this via `docs/` or memory system.
- **Last Updated**: October 2025.

## Navigation Flow
Users start at the main dashboard and navigate through criteria tracking, reports, and settings. Navigation is linear and intuitive, with no complex routing—rely on browser history and direct links.

### Entry Points
- **Main Dashboard**: `src/app/index.html` - Overview of 31 criteria, progress tracking, and quick actions.
- **Login Page**: `src/app/login.html` - Authentication (mocks available via `api/auth/`).
- **Reports**: `src/app/reports.html` - Analytics on claims, savings, and criteria status.

### Key Navigation Paths
1. **Start Here**:
   - Open `src/app/index.html` in a browser.
   - View criteria matrix (31 items across 5 categories).
   - Select a criterion for detailed tracking.

2. **Claims Processing Flow**:
   - From dashboard → Select "Daily Claims" → `src/app/daily-claims-dashboard.html`.
   - Input claim data → Validate against criteria (e.g., invoice precedence, fraud detection).
   - Save to `localStorage` (key: `lctTrackerData`) → Export to CSV/JSON.

3. **Reporting and Analytics**:
   - From dashboard → "Reports" → `src/app/reports.html`.
   - View savings (e.g., 19.8% average), volume (847 claims/week), and top schemes (e.g., MTRH).
   - Filter by criteria or date.

4. **Settings and Team**:
   - `src/app/settings.html` - User preferences, data export.
   - `src/app/team-structure-v2.html` - Organizational view.

5. **Documentation**:
   - `src/app/documentation.html` - Inline help for criteria and usage.

### User Journey Example
- User logs in → Views dashboard → Tracks criterion #4 (Invoice Validation) → Saves progress → Exports report → Logs out.

## Architecture Overview
High-level structure: Static frontend with API support for auth and data. No build process—run directly in browser.

### High-Level Diagram (Text-Based)
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Browser       │    │   API Endpoints │    │   Database      │
│   (HTML/JS/CSS) │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Navigation    │    │   Scripts       │    │   Tests         │
│   (Direct Links)│    │   (Python/Node) │    │   (Playwright)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Key Components
- **Frontend (src/app/)**:
  - HTML files for pages (e.g., `index.html` for dashboard).
  - JavaScript for interactivity (e.g., `auth.js` for login logic).
  - CSS for styling (e.g., `design-tokens.css` for themes).
  - Data: Stored in `localStorage` (key: `lctTrackerData`).

- **Backend/API (api/)**:
  - Node.js scripts for auth (e.g., `login.js`, `logout.js` in `api/auth/`).
  - Lightweight: No full server—functions as needed.

- **Database**:
  - PostgreSQL for user data and claims (setup via `scripts/setup-database.js`).
  - Prisma ORM for queries.

- **Scripts and Utilities (scripts/)**:
  - Python for AI/memory (e.g., `agent_memory_integration.py`).
  - Shell for setup (e.g., `setup-sentinel.sh`).

- **Testing (tests/)**:
  - Unit/Integration: Playwright for UI.
  - Sentinel: Security tests (e.g., `test-accessibility.html`).

- **Deployment**:
  - Vercel (`vercel.json`): Static hosting.
  - Environment: `.env` for secrets (no hardcoding).

- **Integrations**:
  - GitHub: CI/CD workflows.
  - Linear: Issue tracking.
  - Memory System: `memory/` for agent learnings.

### Security Architecture
- **Enforced Rules**: No hardcoded secrets; input validation; OWASP Top 10 compliance via Sentinel.
- **Data Flow**: Claims data → Validate → Store locally → Export securely.
- **Access**: Agents access via `docs/` or memory APIs.

## Running the Website
1. **Local Development**:
   - Open `src/app/index.html` in a browser (no build needed).
   - Test APIs: Run `node api/auth/login.js` for mocks.

2. **Testing**:
   - Run `npm run test:ui` (Playwright).
   - Security: `./test-sentinel.sh`.

3. **Deployment**:
   - Auto-deploy to Vercel on push to main.

## Agent Accessibility
- **Storage**: This doc is in `docs/`—agents can read via `read_file` or memory system.
- **Updates**: Modify via commits; notify agents via memory.
- **Related Docs**: See `CLAUDE.md`, `docs/agents/`, `docs/TECH_STACK.md`.

For changes, update this document and commit to git.
