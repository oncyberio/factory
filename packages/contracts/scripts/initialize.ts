// @ts-ignore
import hre, { ethers } from 'hardhat'

async function main() {
  const contractName = 'DiamondCyberDestinationUtilityFactory'
  const { deployments, getNamedAccounts } = hre
  const namedAccounts = await getNamedAccounts()
  const accounts = await ethers.getSigners()
  const minter = accounts[0]

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )

  const tx = await contract.initialize(
    'ipfs://',
    namedAccounts.managerDestinationUtility,
    namedAccounts.biconomyForwarder,
    namedAccounts.opensea,
    namedAccounts.oncyber
  )
  console.log('tx', tx)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
