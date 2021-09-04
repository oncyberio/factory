// @ts-ignore
import hre, { ethers } from 'hardhat'
import { signMintingRequest } from '../lib/utils'

async function main() {
  const contractName = 'DiamondCyberDestinationFactory'
  const { deployments } = hre
  const accounts = await ethers.getSigners()
  const manager = accounts[1]
  const minter = accounts[0]

  // for testnet
  // const provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
  // const minter = new ethers.Wallet(process.env.MUMBAI_ACCOUNT_1_PRIVATE_KEY as string, provider)
  // const manager = new ethers.Wallet(process.env.MUMBAI_MANAGER_DESTINATION_PRIVATE_KEY as string, provider)

  // for local
  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )

  const uri = 'QmQwfto3zFsasHnvNpyKW7jZVVkAgxpLAKfxQhTbnykHh8'
  const amount = '11'
  const amountOncyber = '1'
  const nonce = await contract.minterNonce(minter.address)
  const signature = await signMintingRequest(
    uri,
    amount,
    amountOncyber,
    nonce.toString(),
    minter.address,
    manager
  )
  const tx = await contract.mint(uri, amount, amountOncyber, signature)
  const txReceipt = await tx.wait()
  const iface = new ethers.utils.Interface(Contract.abi)
  let tokenId = null

  txReceipt.logs.forEach((log: any) => {
    const logParsed = iface.parseLog(log)
    if (logParsed.name === 'Minted') {
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
