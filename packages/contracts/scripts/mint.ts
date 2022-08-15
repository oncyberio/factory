// @ts-ignore-next-line
import { deployments, ethers } from 'hardhat'
import { signMintRequest } from '../lib/utils'

async function main() {
  const contractName = 'DiamondCyberDestinationFactory'

  const accounts = await ethers.getSigners()
  const minter = accounts[3]
  const manager = accounts[2]

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(Contract.abi, Contract.address, minter)
  const tokenId = 0
  const quantity = 1
  const mintPrice = await contract.getMintPriceForToken(tokenId)

  const signatureMint = await signMintRequest(tokenId, quantity, minter.address, 0, manager)

  const estimation = await contract.estimateGas.mint(tokenId, signatureMint, {
    value: mintPrice,
  })

  const tx = await contract.mint(tokenId, signatureMint, {
    value: mintPrice,
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
