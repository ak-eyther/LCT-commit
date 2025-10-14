# Tech Stack Overview - LCT-Vitraya Healthcare Claims System

## Project Context

- **Goal**: Achieve 90%+ adjudication accuracy for healthcare claims processing.
- **Market**: Kenya-focused, with a lightweight, beginner-friendly stack for security and simplicity.
- **Updated**: October 2025 (based on current repo state).

## Frontend (Client-Side)

- **Core Technologies**: HTML5, CSS3, vanilla JavaScript.
  - No frameworks (e.g., no React/Vue) for simplicity.
  - Files: `src/app/*.html` (e.g., `index.html`, dashboards), `src/app/*.js`, `src/assets/css/*.css`.
- **Styling**: Custom CSS with design tokens (e.g., `design-tokens.css`).
- **Features**: Browser-based (no build needed), localStorage for data (key: `lctTrackerData`), WCAG 2.2 accessibility.

## Backend/API

- **Core Technologies**: Node.js.
  - API endpoints: `api/auth/` (e.g., `login.js`, `logout.js`).
  - Utilities: `scripts/*.js` (e.g., `add-user.js`, database setup).
- **Database**: PostgreSQL with Prisma ORM.
  - Setup via `scripts/setup-database.js`.
- **Features**: Lightweight, secure (no hardcoded secrets), supports auth and data handling.

## Scripts and Utilities

- **Languages**: Python (e.g., `scripts/agent_memory_integration.py`, `scripts/test-complete-system.py`), Bash/Shell (e.g., `setup-sentinel.sh`).
- **Tools**: Automation for memory systems, testing, and security (e.g., Sentinel).

## Testing and Quality

- **Framework**: Playwright (UI/integration tests via `package.json`).
- **Tools**: Custom security tests (`tests/sentinel/*.js`), Lighthouse for performance.
- **Automation**: GitHub Actions for CI/CD and Linear integration.

## Deployment and Hosting

- **Platform**: Vercel (`vercel.json` for config).
- **Environment**: `.env` files (secrets, no hardcoding).
- **Process**: Static sites (open HTML in browser) or simple Node scripts.

## Development Tools and Integrations

- **Package Management**: npm (`package.json` for dependencies).
- **Version Control**: Git/GitHub with PR workflows.
- **AI/Automation**: Custom agents (e.g., Sentinel for code review), JSON-based memory system (`memory/`).
- **Documentation**: Markdown (`docs/*.md`), no complex builds.

## Key Principles

- **Beginner-Friendly**: Simple code, well-commented, no steep learning curves.
- **Security-First**: OWASP Top 10 compliance, input validation, encrypted data.
- **Running the Project**: Open `src/app/index.html` in a browser or run Node scripts (e.g., `node scripts/add-user.js`).

For updates or expansions, refer to `CLAUDE.md` and `package.json`.
