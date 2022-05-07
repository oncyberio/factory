// @ts-ignore-next-line
import { deployments, ethers } from 'hardhat'
import { signMintRandomRequest } from '../lib/utils'

async function main() {
  const contractName = 'DiamondCyberDestinationFactory'

  const accounts = await ethers.getSigners()
  const minter = accounts[3]
  const manager = accounts[2]

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )
  const tokenIds = [1, 2, 3]
  const drop = await contract.getDrop(tokenIds[1])
  const mintPrice = drop.price

  const signatureMintRandom = await signMintRandomRequest(
    tokenIds,
    minter.address,
    manager
  )

  const estimation = await contract.estimateGas.mintRandom(
    tokenIds,
    signatureMintRandom,
    {
      value: mintPrice,
    }
  )

  const tx = await contract.mintRandom(tokenIds, signatureMintRandom, {
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
