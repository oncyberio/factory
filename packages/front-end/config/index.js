console.log("MIN ONCYBER SHARES")
console.log(process.env.NEXT_PUBLIC_MIN_ONCYBER_SHARES)
const config = {
  env: process.env.NODE_ENV || 'development',
  supportedContracts: process.env.SUPPORTED_CONTRACTS ? process.env.SUPPORTED_CONTRACTS.split(',') : ['destination', 'destinationUtility'],
  destination: {
    allowedMinter: process.env.DESTINATION_ALLOWED_MINTER_ADDRESS ? process.env.DESTINATION_ALLOWED_MINTER_ADDRESS.split(',') : ['0xBeb171bA24e66014F356Bca0DB05329EFea14964', '0x76DB02500F7631d57BC2DcDCa9d4cf782b99E119'],
    minterNonceMax: parseInt(process.env.DESTINATION_MINTER_MAX_NONCE || '99'),
    minOncyberShares: parseFloat(process.env.NEXT_PUBLIC_DESTINATION_MIN_ONCYBER_SHARES || '0.3'), // 30%
  },
  destinationUtility: {
    allowedMinter: process.env.DESTINATION_UTILITY_ALLOWED_MINTER_ADDRESS ? process.env.DESTINATION_UTILITY_ALLOWED_MINTER_ADDRESS.split(',') : ['0xBeb171bA24e66014F356Bca0DB05329EFea14964', '0x76DB02500F7631d57BC2DcDCa9d4cf782b99E119'],
    minterNonceMax: parseInt(process.env.DESTINATION_UTILITY_MINTER_MAX_NONCE || '99'),
    minOncyberShares: parseFloat(process.env.NEXT_PUBLIC_DESTINATION_UTILITY_MIN_ONCYBER_SHARES || '0.3'), // 30%
  },
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET,
    externalUrlBase:
      process.env.PINATA_EXTERNAL_URL_BASE || 'https://oncyber.io/destinations/',
  },
  privateKey:
    process.env.PRIVATE_KEY ||
    '0x4a8b3d307c0f1788977dd873310b37c0d00e5a7f5f16994b683199601acea0d3', //0x2968cC604C2b29b031C0E773300074992c9C5C13
}

export default config;
