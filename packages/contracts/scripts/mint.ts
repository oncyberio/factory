// @ts-ignore-next-line
import { deployments, ethers } from 'hardhat'

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

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )
  const tokenId = 0
  const mintPrice = await contract.getMintPriceForToken(tokenId)
  const tx = await contract.mint(tokenId, {
    value: mintPrice,
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
