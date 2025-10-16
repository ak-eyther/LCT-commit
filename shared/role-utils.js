(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.lctRoleUtils = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const ALLOWED_ROLES = ['admin', 'user'];

  function normalizeRole(role = 'user') {
    if (typeof role !== 'string') {
      throw new Error('Role must be a string');
    }
    const normalized = role.trim().toLowerCase();
    if (!ALLOWED_ROLES.includes(normalized)) {
      throw new Error(`Role must be one of: ${ALLOWED_ROLES.join(', ')}`);
    }
    return normalized;
  }

  return { ALLOWED_ROLES, normalizeRole };
});
