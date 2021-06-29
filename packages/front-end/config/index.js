
const config = {
  env: process.env.NEXT_PUBLIC_NODE_ENV || 'development',
  supportedContracts: process.env.SUPPORTED_CONTRACTS ? process.env.SUPPORTED_CONTRACTS.split(',') : ['destination', 'destinationUtility'],
  destination: {
    allowedMinter: process.env.DESTINATION_ALLOWED_MINTER_ADDRESS ? process.env.DESTINATION_ALLOWED_MINTER_ADDRESS.split(',') : ['0xBeb171bA24e66014F356Bca0DB05329EFea14964', '0x9e82ba3123107087aEeEfc46f6e47810f29537dF'],
    minterNonceMax: parseInt(process.env.DESTINATION_MINTER_MAX_NONCE || '99'),
    minOncyberShares: parseFloat(process.env.NEXT_PUBLIC_MIN_ONCYBER_SHARES || '0.3'), // 30%
    rpc: process.env.NEXT_PUBLIC_ETH_RPC || 'https://rinkeby.infura.io/v3/b89e58ca51184cb783845c58340629c4',
    managerPrivateKey:
      process.env.DESTINATION_MANAGER_PRIVATE_KEY ||
      '0x4a8b3d307c0f1788977dd873310b37c0d00e5a7f5f16994b683199601acea0d3', //0x2968cC604C2b29b031C0E773300074992c9C5C13
  },
  destinationUtility: {
    allowedMinter: process.env.DESTINATION_UTILITY_ALLOWED_MINTER_ADDRESS ? process.env.DESTINATION_UTILITY_ALLOWED_MINTER_ADDRESS.split(',') : ['0xBeb171bA24e66014F356Bca0DB05329EFea14964', '0x76DB02500F7631d57BC2DcDCa9d4cf782b99E119'],
    minterNonceMax: parseInt(process.env.DESTINATION_UTILITY_MINTER_MAX_NONCE || '99'),
    minOncyberShares: parseFloat(process.env.NEXT_PUBLIC_MIN_ONCYBER_SHARES || '0.3'), // 30%
    rpc: process.env.NEXT_PUBLIC_MATIC_RPC || 'https://rpc-mumbai.matic.today',
    managerPrivateKey:
      process.env.DESTINATION_UTILITY_MANAGER_PRIVATE_KEY ||
      '0x4a8b3d307c0f1788977dd873310b37c0d00e5a7f5f16994b683199601acea0d3', //0x2968cC604C2b29b031C0E773300074992c9C5C13
  },
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET,
    externalUrlBase:
      process.env.PINATA_EXTERNAL_URL_BASE || 'https://oncyber.io/destinations/',
  },
  biconomyApiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY || 'iK6oLx9Lw.c19fe6a5-924e-49dc-8a28-e54466b7ccd8',
  currentContract: process.env.NEXT_PUBLIC_DESTINATION_CURRENT || 'destination'
}

export default config;
