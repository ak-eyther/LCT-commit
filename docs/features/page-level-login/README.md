# Page-Level Login Rollout

This branch tracks the upcoming work to apply authentication checks page-by-page across the LCT dashboard.

## Objectives
- Introduce fine-grained access control without blocking public marketing or read-only pages.
- Maintain a single source of truth for shared auth utilities while allowing public overrides.
- Provide migration notes so QA and release teams understand which routes require login after each phase.

## Initial Tasks
- [ ] Audit every page under `src/app/` and tag required access level (`public`, `authenticated`, `restricted`).
- [ ] Update `auth.js` to accept a configuration map instead of hard-coded exceptions.
- [ ] Add regression tests in `tests/unit` that validate redirects for protected pages.
- [ ] Document environment toggles (e.g., feature flags) in `docs/`.

## Verification
- Local smoke tests using the existing mock auth endpoints.
- `npm run test:ui` with scenarios covering both authenticated and public routes.
- `./test-sentinel.sh` once redirects are implemented to ensure no security regressions.
