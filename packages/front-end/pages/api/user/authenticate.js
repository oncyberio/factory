const jwt = require('jsonwebtoken')
const ethUtil = require('ethereumjs-util')

function toHex(s) {
  let hex = ''

  for (let i = 0; i < s.length; i++) {
    hex += '' + s.charCodeAt(i).toString(16)
  }

  return `0x${hex}`
}

export default (req, res) => {
  try {
    const sig = req.body.sig
    const owner = req.body.owner

    // Same data as before
    const data = toHex(
      'Welcome to Cyber! This message allows us to make your account secure.'
    )

    const message = ethUtil.toBuffer(data)
    const msgHash = ethUtil.hashPersonalMessage(message)

    // Get the address of whoever signed this message
    const signature = ethUtil.toBuffer(sig)
    const sigParams = ethUtil.fromRpcSig(signature)
    const publicKey = ethUtil.ecrecover(
      msgHash,
      sigParams.v,
      sigParams.r,
      sigParams.s
    )
    const sender = ethUtil.publicToAddress(publicKey)
    const addr = ethUtil.bufferToHex(sender)

    // Determine if it is the same address as 'owner'
    if (addr == owner) {
      // if (addr in whitelist) continue, otherwise we got an error

      // If the signature matches the owner supplied, create a
      // JSON web token for the owner that expires in 24 hours.
      const token = jwt.sign({ user: owner }, process.env.SECRET_JWT_KEY, {
        expiresIn: '1d',
      })

      // res.setHeader('Set-Cookie', serialize('token', 'token_cookie_value', { path: '/' }));
      res.json({ success: true, token: token })
    } else {
      // If the signature doesn’t match, error out
      res.json({ success: false, message: 'Signature did not match.' })
    }
  } catch (err) {
    console.log(err)
    res.status(400).json({
      success: false,
      message: 'Failed to authenticate.',
    })
  }
}
