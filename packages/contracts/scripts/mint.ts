// @ts-ignore
import hre, { ethers } from 'hardhat'
import { signMintingRequest } from '../lib/utils'

async function main() {
  const { deployments } = hre
  // const accounts = await ethers.getSigners()
  // const manager = accounts[1]
  // const minter = accounts[0]

  const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
  const minter = new ethers.Wallet(process.env.MUMBAI_ACCOUNT_1_PRIVATE_KEY as string, provider)
  const manager = new ethers.Wallet(process.env.MUMBAI_MANAGER_PRIVATE_KEY as string, provider)

  const Contract = await deployments.get('DiamondCyber')
  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )

  const uri = 'QmQwfto3zFsasHnvNpyKW7jZVVkAgxpLAKfxQhTbnykHh8'
  const amount = '11'
  const nonce = await contract.minterNonce(minter.address)
  const signature = await signMintingRequest(
    uri,
    amount,
    nonce.toString(),
    minter.address,
    manager
  )
  const tx = await contract.mint(uri, amount, signature)
  await tx.wait()

  const balanceMinter = await contract.balanceOf(minter.address, 0)
  console.log('balanceMinter token 0', balanceMinter.toString())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
