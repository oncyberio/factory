
console.log("MIN ONCYBER SHARES")
console.log(process.env.NEXT_PUBLIC_MIN_ONCYBER_SHARES)
const config = {
  env: process.env.NODE_ENV || 'development',
  minterNonceMax: parseInt(process.env.MINTER_MAX_NONCE || '99'),
  allowedMinter: process.env.ALLOWED_MINTER_ADDRESS ? process.env.ALLOWED_MINTER_ADDRESS.split(',') : ['0xBeb171bA24e66014F356Bca0DB05329EFea14964', '0x76DB02500F7631d57BC2DcDCa9d4cf782b99E119', '0x584E34B153038a19fFf3cdb87942a736Aa0045E4'],
  minOncyberShares: parseFloat(process.env.NEXT_PUBLIC_MIN_ONCYBER_SHARES || '0.3'), // 30%
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET,
    externalUrlBase:
      process.env.PINATA_EXTERNAL_URL_BASE || 'https://oncyber.io/destinations/',
  },
  privateKey:
    process.env.PRIVATE_KEY ||
    '0x4a8b3d307c0f1788977dd873310b37c0d00e5a7f5f16994b683199601acea0d3', //0x2968cC604C2b29b031C0E773300074992c9C5C13
  biconomyApiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY || 'iK6oLx9Lw.c19fe6a5-924e-49dc-8a28-e54466b7ccd8'
}

export default config;
