import { deployments, ethers } from 'hardhat'

async function main() {
  const contractName = 'DiamondCyberDestinationUtilityFactory'

  const accounts = await ethers.getSigners()
  const minter = accounts[0]
  const manager = accounts[0]

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(Contract.abi, Contract.address, minter)
  const tokenId = 1

  const burn = await contract.burnTransfer(1, false)
  const txReceipt = await burn.wait()
  console.log('txReceipt', txReceipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
