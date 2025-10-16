# Page-Level Login Enhancements

This branch implements role-aware authentication across the LCT dashboard. All HTML entrypoints now load `auth.js`, which verifies JWT tokens before rendering protected content. The shared script also exposes a `lct-auth-ready` event so feature-specific code can react once the current user is known.

## Roles

- `admin`: Can provision additional users and manage elevated tooling.
- `user`: Standard dashboard access without administration privileges.

Every token now embeds the `role` claim, and `auth.js` persists it in `localStorage` for front-end checks. Pages that require elevated access can define `window.lctAuthConfig = { requiredRole: 'admin' }` before loading `auth.js`.

## Admin User Provisioning

Settings now includes an admin-only card with a form that calls `POST /api/auth/admin/create-user`. The flow:

1. Auth script verifies the current token and dispatches `lct-auth-ready`.
2. Settings listens for the event, reveals the form only for admins, and wires up submission handlers.
3. Admins can create either `admin` or `user` accounts. Passwords must be at least six characters.
4. Responses surface inline feedback, and successes reuse the global toast.

The API relies on Vercel Postgres when available and falls back to `mock-users.json` during local development. CLI helper `scripts/add-user.js` also supports a third `[role]` argument for seeding admins.

## Verification

- Manual: Attempt to load any page without a token → redirected to `login.html`.
- Admin toggle: Log in as an admin, open Settings, and create a user. Log in as a standard user to confirm the admin card stays hidden.
- API: `curl -X POST /api/auth/admin/create-user` with a non-admin token returns `403`.
