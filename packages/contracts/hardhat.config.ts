import 'dotenv/config'
import { HardhatUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-etherscan'
import '@typechain/hardhat'
import 'hardhat-deploy'
import 'hardhat-deploy-ethers'
import 'hardhat-gas-reporter'
import { removeConsoleLog } from 'hardhat-preprocessor'
import 'hardhat-tracer'
import 'solidity-coverage'
import { parseUnits } from 'ethers/lib/utils'

const defaultPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' // hardhat 0
const defaultManagerAddress = '0xE4D29ec42F4057EfF92c9124c82844b2689f9C6d'

const config: HardhatUserConfig = {
  preprocess: {
    eachLine: removeConsoleLog( (hre) => hre.network.name !== 'localhost' && hre.network.name !== 'hardhat'),
  },
  gasReporter: {
    currency: 'EUR',
    enabled: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPrice: 100 // in gwei
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    manager: process.env.MANAGER_ADDRESS || defaultManagerAddress,
  },
  networks: {
    localhost: {
      url: `http://localhost:8545`,
      accounts: [
        defaultPrivateKey,
      ]
    },
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      gasPrice: parseUnits('5', 'gwei').toNumber(),
      accounts: [
        process.env.RINKEBY_PRIVATE_KEY || defaultPrivateKey,
      ]
    }
  },
}

export default config
