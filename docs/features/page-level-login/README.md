# Page-Level Login Enhancements

This branch implements role-aware authentication across the LCT dashboard. All HTML entrypoints now load `auth.js`, which verifies JWT tokens before rendering protected content. The shared script also exposes a `lct-auth-ready` event so feature-specific code can react once the current user is known.

## Roles

- `admin`: Can provision additional users and manage elevated tooling.
- `user`: Standard dashboard access without administration privileges.

Every token now embeds the `role` claim, and `auth.js` persists it in `localStorage` for front-end checks. Pages that require elevated access can define `window.lctAuthConfig = { requiredRole: 'admin' }` before loading `auth.js`.

## Admin User Provisioning

Settings includes an admin-only card with a form that calls `POST /api/auth/admin/create-user`. The flow:

1. `auth.js` verifies the current token and dispatches `lct-auth-ready`.
2. Settings listens for the event, reveals the form only for admins, and wires up submission handlers.
3. Admins can create either `admin` or `user` accounts. Passwords must be at least six characters.
4. Responses surface inline feedback, and successes reuse the global toast.

The API relies on Vercel Postgres when available and falls back to generating `mock-users.json` during local development. Configure `MOCK_ADMIN_EMAIL` / `MOCK_ADMIN_PASSWORD` in `.env` to seed the mock admin account. CLI helper `scripts/add-user.js` also supports a third `[role]` argument for seeding admins.

## Shared Role Utilities

A universal `shared/role-utils.js` module normalizes roles (trim + lowercase) and validates against the allowed list. The module exposes a UMD wrapper so backend scripts (`api/auth/*`, `scripts/add-user.js`) and browser pages (`auth.js`, `login.html`) consume the same logic without drift.

## Verification

- Manual: attempt to load any page without a token → redirected to `login.html`.
- Admin toggle: log in as an admin, open Settings, and create a user. Log in as a standard user to confirm the admin card stays hidden.
- API: `curl -X POST /api/auth/admin/create-user` with a non-admin token returns `403`.

