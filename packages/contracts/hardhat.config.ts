import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'
import { parseUnits } from 'ethers/lib/utils'
import 'hardhat-deploy'
import { removeConsoleLog } from 'hardhat-preprocessor'
import 'hardhat-tracer'
import { HardhatUserConfig } from 'hardhat/types'

// hardhat 0 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
const defaultPrivateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

const config: HardhatUserConfig = {
  preprocess: {
    eachLine: removeConsoleLog((hre) => hre.network.name !== 'localhost' && hre.network.name !== 'hardhat'),
  },
  gasReporter: {
    currency: 'EUR',
    enabled: true,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    gasPrice: 100, // in gwei
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: '0.8.15',
      },
      {
        version: '0.7.6',
      },
    ],
  },
  namedAccounts: {
    deployer: 0,
    oncyber: process.env.ONCYBER_ADDRESS || 1,
    managerDestination: process.env.MANAGER_DESTINATION_ADDRESS || 2,
    managerDestinationUtility: process.env.MANAGER_DESTINATION_UTILITY_ADDRESS || 3,
    managerObject: process.env.MANAGER_OBJECT_ADDRESS || 3,
    managerAndFriends: process.env.MANAGER_ANDFRIENDS_ADDRESS || 3,
    managerCommunity: process.env.MANAGER_COMMUNITY_ADDRESS || 3,
    biconomyForwarder: process.env.BICONOMY_FORWARDER || '0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b',
    opensea: process.env.OPENSEA || '0x53d791f18155c211ff8b58671d0f7e9b50e596ad',
  },
  networks: {
    localhost: {
      url: `http://localhost:8545`,
      // accounts: [
      // defaultPrivateKey,
      // ]
      gasPrice: parseUnits('10', 'gwei').toNumber(),
    },
    // ETHEREUM
    rinkeby: {
      chainId: 4,
      url: 'https://rinkeby.infura.io/v3/b89e58ca51184cb783845c58340629c4',
      gasPrice: parseUnits('2', 'gwei').toNumber(),
      accounts: [process.env.RINKEBY_PRIVATE_KEY || defaultPrivateKey]
        .concat(process.env.RINKEBY_ACCOUNT_1_PRIVATE_KEY ? process.env.RINKEBY_ACCOUNT_1_PRIVATE_KEY : [])
        .concat(
          process.env.RINKEBY_MANAGER_DESTINATION_PRIVATE_KEY ? process.env.RINKEBY_MANAGER_DESTINATION_PRIVATE_KEY : []
        ),
    },
    goerli: {
      chainId: 5,
      url: 'https://goerli.infura.io/v3/b89e58ca51184cb783845c58340629c4',
      gasPrice: parseUnits('5', 'gwei').toNumber(),
      accounts: [process.env.GOERLI_PRIVATE_KEY || defaultPrivateKey]
        .concat(process.env.GOERLI_ACCOUNT_1_PRIVATE_KEY ? process.env.GOERLI_ACCOUNT_1_PRIVATE_KEY : [])
        .concat(
          process.env.GOERLI_MANAGER_DESTINATION_PRIVATE_KEY ? process.env.GOERLI_MANAGER_DESTINATION_PRIVATE_KEY : []
        ),
    },
    polygon: {
      chainId: 137,
      url: process.env.POLYGON_RPC || 'https://polygon.infura.io/v3/b89e58ca51184cb783845c58340629c4',
      gasPrice: parseUnits('50', 'gwei').toNumber(),
      accounts: [process.env.POLYGON_PRIVATE_KEY || defaultPrivateKey],
    },
    ethereum: {
      chainId: 1,
      url: process.env.ALCHEMY_URL || 'https://mainnet.infura.io/v3/b89e58ca51184cb783845c58340629c4',
      gasPrice: parseUnits('14', 'gwei').toNumber(),
      accounts: [process.env.ETHEREUM_FACTORY_PRIVATE_KEY || defaultPrivateKey],
    },
  },
}

export default config
