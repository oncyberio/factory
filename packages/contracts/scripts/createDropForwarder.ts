import { Biconomy } from '@biconomy/mexa'
import { BigNumber } from 'ethers'
import { deployments, ethers } from 'hardhat'
import { signCreateDropRequest } from '../lib/utils'

const ethersProvider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
const biconomy = new Biconomy(ethersProvider, {
  apiKey: process.env.BICONOMY_API_KEY,
  debug: false,
})

async function main() {
  const contractName = 'DiamondCyberDestinationFactory'
  const minter = new ethers.Wallet(process.env.MUMBAI_ACCOUNT_1_PRIVATE_KEY as string).connect(ethersProvider)
  const manager = new ethers.Wallet(process.env.MUMBAI_MANAGER_DESTINATION_PRIVATE_KEY as string)
  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(Contract.abi, Contract.address, minter)
  const contractInterface = new ethers.utils.Interface(Contract.abi)

  const uri = 'QmQwfto3zFsasHnvNpyKW7jZVVkAgxpLAKfxQhTbnykHh8'
  const timeStart = parseInt((Date.now() / 1000).toString())
  const timeEnd = parseInt((Date.now() / 1000 + 100000000).toString())
  const price = 100
  const amountCap = 10
  const shareCyber = 50
  const nonce = await contract.minterNonce(minter.address)
  const signatureManager = await signCreateDropRequest(
    uri,
    timeStart,
    timeEnd,
    BigNumber.from(price),
    amountCap,
    shareCyber,
    minter.address,
    nonce,
    manager
  )

  const functionSignature = contractInterface.encodeFunctionData('createDrop', [
    uri,
    timeStart,
    timeEnd,
    price,
    amountCap,
    shareCyber,
    minter.address,
    nonce,
    signatureManager,
  ])

  const rawTx = {
    to: Contract.address,
    data: functionSignature,
    from: minter.address,
  }

  const signedTx = await minter.signTransaction(rawTx)
  await new Promise((resolve, reject) =>
    biconomy.onEvent(biconomy.READY, () => resolve(true)).onEvent(biconomy.ERROR, (error: Error) => reject(error))
  )

  const forwardData = await biconomy.getForwardRequestAndMessageToSign(signedTx)
  console.log(forwardData)

  const signature = await minter.signMessage(forwardData.personalSignatureFormat)

  const data = {
    signature: signature,
    forwardRequest: forwardData.request,
    rawTransaction: signedTx,
    signatureType: biconomy.PERSONAL_SIGN,
  }

  const provider = biconomy.getEthersProvider()
  const txHash = await provider.send('eth_sendRawTransaction', [data])

  console.log('txHash', txHash)
  const receipt = await provider.waitForTransaction(txHash)
  console.log('receipt', receipt)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
