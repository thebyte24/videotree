const express = require('express')
const router  = express.Router()

// POST /api/auth/login
// Returns the password as a token (simple — upgrade to JWT for production)
router.post('/login', (req, res) => {
  const { password } = req.body
  if (!password) return res.status(400).json({ error: 'Password required' })

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' })
  }

  // For now the token IS the password — swap for JWT later
  res.json({ token: process.env.ADMIN_PASSWORD })
})

module.exports = router
