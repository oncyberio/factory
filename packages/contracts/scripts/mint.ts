// @ts-ignore-next-line
import { BigNumber } from '@ethersproject/bignumber'
import { deployments, ethers } from 'hardhat'
import { signMintRequest } from '../lib/utils'

async function main() {
  const contractName = 'DiamondCyberDestinationFactory'

  // for local
  // const accounts = await ethers.getSigners()
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
  const tokenId = 8

  const mintPrice = await contract.getMintPriceForToken(tokenId)

  const signatureMint = await signMintRequest(
    tokenId,
    minter.address,
    0,
    manager
  )

  const estimation = await contract.estimateGas.mint(tokenId, signatureMint, {
    value:
        mintPrice
  })

  console.log("ESTIMATION")
  // console.log(BigNumber.from("1.1"))
  console.log(estimation.mul(ethers.utils.parseUnits("1.1")))

  const tx = await contract.mint(tokenId, signatureMint, {
    value: mintPrice,
    gasLimit: estimation.mul(ethers.utils.parseUnits("1.1"))
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
