// This should be detected as CRITICAL
function getUserData(userId) {
  const query = 'SELECT * FROM users WHERE id = ' + userId;
  return db.query(query);
}

function searchUsers(name) {
  return db.execute(`SELECT * FROM users WHERE name = '${name}'`);
}
