/**
 * Simple token-based auth middleware.
 * The frontend sends the admin password as a Bearer token.
 * For production, replace with JWT.
 */
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

module.exports = requireAdmin
