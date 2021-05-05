export interface ConfigPinata {
  apiKey: string
  apiSecret: string
  externalUrlBase: string
}

export interface Config {
  env: string
  pinata: ConfigPinata
  privateKey: string
}

const config: Config = {
  env: process.env.NODE_ENV || 'development',
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    apiSecret: process.env.PINATA_API_SECRET,
    externalUrlBase: process.env.PINATA_EXTERNAL_URL_BASE || 'https://oncyber.io/scenes/'
  },
  privateKey: process.env.PRIVATE_KEY || '0x4a8b3d307c0f1788977dd873310b37c0d00e5a7f5f16994b683199601acea0d3', //0x2968cC604C2b29b031C0E773300074992c9C5C13
}

export { config }
