const jwt = require('jsonwebtoken')

export default (req, res) => {
  const { owner, type } = req.body

  if (!owner)
    return res.json({
      success: false,
      message: 'No ethereum address specified.',
    })

  // if (addr in whitelist) continue, otherwise we got an error

  const token = jwt.sign({ user: owner, type }, process.env.SECRET_JWT_KEY, {
    expiresIn: '1d',
  })

  res.json({ success: true, token: token })
}
