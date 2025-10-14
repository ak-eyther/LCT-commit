# Repository Guidelines

## Project Structure & Module Organization

The tracker UI lives in `src/app` (HTML entrypoints plus inline JS) with shared styles in `src/assets/css`. Browser-backed APIs reside under `api/auth` for login, logout, and token verification. Automation and data utilities are in `scripts/`, while long-term agent context is persisted in `memory/`. Contributor-facing references, branching rules, and agent manifests sit in `docs/`. Tests are grouped by intent in `tests/unit`, `tests/integration`, and `tests/sentinel`.

## Build, Test, and Development Commands

- `npm install` installs Node utilities used by Playwright, Lighthouse, and scripting helpers.
- `npm run setup-db` provisions the Postgres `users` table; follow with `node scripts/add-user.js "$EMAIL" "$PASSWORD"` to seed credentials.
- `npm run test:ui` runs Playwright smoke checks once the Athena Guard harness (`scripts/athena-guard.js`) is synced; pull it from your agent bundle before executing.
- `./test-sentinel.sh` performs the opinionated security and regression gate prior to merging; for a deeper pass, run `python3 scripts/test-complete-system.py`.

## Coding Style & Naming Conventions

Prefer semantic HTML with four-space indentation and compact inline scripts; keep CSS tokens in `src/assets/css/design-tokens.css`. JavaScript and Node helpers use camelCase functions and kebab-case filenames (for example, `test-linear-workflow.js`). Surface configuration via environment variables (see `.env.example`) and gate secrets with `.gitignore`. When updating docs, mirror existing heading emoji usage only when it adds clarity—plain titles remain the default.

## Testing Guidelines

Author tests alongside features inside the matching `tests/*` subfolder; new browser flows belong in Playwright specs inside `tests/unit`. Name specs `test-*.js` so sentinel tooling picks them up. Run `npm run test:ui` on every branch before requesting review, and attach relevant `tests/integration/*.md` updates if you adjust process documentation. For security-sensitive changes, add or amend sentinel cases in `tests/sentinel`.

## Commit & Pull Request Guidelines

Follow the lightweight conventional style visible in `git log`: `<type>: <concise summary>` (for example, `fix:` or `chore:`) with optional issue tags. Branch off `main` using `feature/<topic>` or `fix/<topic>` per `docs/BRANCHING_STRATEGY.md`. Pull requests should link the motivating issue, describe verification steps, and include screenshots or GIFs when UI changes affect the dashboard. Update relevant documentation before requesting approval and tag maintainers whenever `AGENTS.md` changes.

## Security & Configuration Tips

Duplicate `.env.example` to `.env` and supply `POSTGRES_URL` before running auth scripts. Never commit secrets or memory snapshots; inspect `memory/` outputs locally instead. Validate any new external integrations against `docs/SECURITY_BEST_PRACTICES.md`, and confirm Vercel settings align with `vercel.json` when deploying configuration changes.
