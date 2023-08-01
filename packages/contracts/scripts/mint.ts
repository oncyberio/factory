import { BigNumber } from 'ethers'
import { config, deployments, ethers, network } from 'hardhat'
import { signMintRequest } from '../lib/utils'

async function main() {
  const contractName = 'DiamondCyberDestinationUtilityFactory'

  const accounts = await ethers.getSigners()
  const minter = accounts[0]
  const manager = accounts[0]

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(Contract.abi, Contract.address, minter)
  const tokenId = 1
  const quantity = 30
  const mintPrice = 0

  const signatureMint = await signMintRequest(tokenId, quantity, minter.address, 0, manager)

  const estimation = await contract.estimateGas.mint(tokenId, quantity, signatureMint, {
    gasPrice: BigNumber.from(config.networks[network.name].gasPrice),
    value: mintPrice,
  })

  const tx = await contract.mint(tokenId, quantity, signatureMint, {
    value: mintPrice,
    gasPrice: BigNumber.from(config.networks[network.name].gasPrice),
    gasLimit: estimation.mul(100).div(90),
  })

  const txReceipt = await tx.wait()
  console.log('txReceipt', txReceipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
