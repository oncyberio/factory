// @ts-ignore-next-line
import { deployments, ethers } from 'hardhat'
import { Log } from '@ethersproject/abstract-provider/src.ts/index'
import { signCreateDropRequest } from '../lib/utils'

async function main() {
  const contractName = 'DiamondCyberDestinationFactory'

  // for local
  // const accounts = await ethers.getSigners()
  // const manager = accounts[1]
  // const minter = accounts[0]

  // for testnet
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rinkeby.infura.io/v3/b89e58ca51184cb783845c58340629c4'
  )
  const minter = new ethers.Wallet(
    process.env.RINKEBY_ACCOUNT_1_PRIVATE_KEY as string,
    provider
  )
  const manager = new ethers.Wallet(
    process.env.RINKEBY_MANAGER_DESTINATION_PRIVATE_KEY as string,
    provider
  )

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )

  const uri = 'QmQwfto3zFsasHnvNpyKW7jZVVkAgxpLAKfxQhTbnykHh8'
  const timeStart = parseInt((Date.now() / 1000).toString())
  const timeEnd = parseInt((Date.now() / 1000 + 100000000).toString())
  const priceStart = 1000000000
  const priceEnd = 1000
  const stepDuration = 300
  const amountCap = 100
  const shareCyber = 50
  const nonce = await contract.minterNonce(minter.address)
  const signature = await signCreateDropRequest(
    uri,
    timeStart,
    timeEnd,
    priceStart,
    priceEnd,
    stepDuration,
    amountCap,
    shareCyber,
    minter.address,
    nonce,
    manager
  )
  const tx = await contract.createDrop(
    uri,
    timeStart,
    timeEnd,
    priceStart,
    priceEnd,
    stepDuration,
    amountCap,
    shareCyber,
    signature
  )
  const txReceipt = await tx.wait()
  const iFace = new ethers.utils.Interface(Contract.abi)
  let tokenId = null

  txReceipt.logs.forEach((log: Log) => {
    const logParsed = iFace.parseLog(log)
    if (logParsed.name === 'DestinationMinted') {
      tokenId = logParsed.args[1].toString()
      console.log('tokenId', tokenId)
    }
  })
  const balanceMinter = await contract.balanceOf(minter.address, tokenId)
  console.log('balanceMinter token 0', balanceMinter.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
