import { parseEther } from 'ethers/lib/utils'
import { deployments, ethers } from 'hardhat'
import { Log } from 'hardhat-deploy/dist/types'
import { signCreateDropRequest } from '../lib/utils'

async function main() {
  const contractName = 'DiamondCyberDestinationFactory'

  const accounts = await ethers.getSigners()
  const manager = accounts[2]
  const minter = accounts[0]

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(Contract.abi, Contract.address, minter)

  const uri = 'QmQwfto3zFsasHnvNpyKW7jZVVkAgxpLAKfxQhTbnykHh8'
  const timeStart = parseInt((Date.now() / 1000).toString())
  const timeEnd = parseInt((Date.now() / 1000 + 100000000).toString())
  const priceStart = parseEther('1')
  const priceEnd = parseEther('0.1')
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
    if (logParsed.name === 'DropCreated') {
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
