import assert from 'assert'
import { BigNumber } from 'ethers'
import { getAddress } from 'ethers/lib/utils'
import * as fs from 'fs'
import { config, deployments, ethers, network } from 'hardhat'
import path from 'path'
import { displayAmount } from '../../lib/utils'
import receiversData from './receiversData.json'

function chunkArray(array: any[], chunkSize: number): any[] {
  const chunks = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

async function main() {
  const receiversDataPath = path.join(__dirname, './receiversData.json')
  const contractName = 'DiamondOnCyberAndFriendsFactory'
  const batchSize = 50
  const tokenId = 0

  const accounts = await ethers.getSigners()
  const sender = accounts[5]

  const Contract = await deployments.get(contractName)
  const contract = await ethers.getContractAt(Contract.abi, Contract.address, sender)
  const onCyberMultiSenderDeployment = await deployments.get('OnCyberMultiSender')
  const onCyberMultiSender = await ethers.getContractAt(
    onCyberMultiSenderDeployment.abi,
    onCyberMultiSenderDeployment.address,
    sender
  )
  const receiversDataRemains = receiversData.filter(
    (receiverData: any) => !['pending', 'done'].includes(receiverData.status)
  )
  const quantityRemains = receiversDataRemains.reduce((acc, receiverDataRemains) => {
    acc += receiverDataRemains.quantity
    return acc
  }, 0)
  const senderBalance = await contract.balanceOf(sender.address, tokenId)
  const senderNativeBalance = await ethers.provider.getBalance(sender.address)
  assert(
    senderBalance.gte(quantityRemains),
    `Sender balance ${senderBalance.toString()} not enough to send ${quantityRemains.toString()}`
  )
  const remainsAddresses = receiversDataRemains.map((receiverDataRemains: any) => receiverDataRemains.address)
  assert(Array.from(new Set(remainsAddresses)).length === remainsAddresses.length, 'Receivers address duplicated')
  assert(
    !receiversDataRemains.find(
      (receiverDataRemains: any) => receiverDataRemains.address !== getAddress(receiverDataRemains.address)
    ),
    'Address incorrect'
  )
  console.info(
    `Sender ${
      sender.address
    } balance token ${senderBalance.toString()} quantity remains to send ${quantityRemains} native balance ${displayAmount(
      senderNativeBalance
    )}`
  )

  const isApproved = await contract.isApprovedForAll(sender.address, onCyberMultiSender.address)
  if (!isApproved) {
    console.info('Approve multi sender')
    const tx = await contract.setApprovalForAll(onCyberMultiSender.address, true, {
      gasPrice: BigNumber.from(config.networks[network.name].gasPrice),
    })
    console.info(`Tx approval pending ${tx.hash}`)
    await tx.wait()
    console.info(`Tx approval done ${tx.hash}`)
  } else {
    console.info('Multi sender is approved')
  }

  console.info(
    `Start multi send ${contractName} token id ${tokenId} remains ${receiversDataRemains.length}/${receiversData.length} receivers`
  )

  const receiversDataRemainsChunks = chunkArray(receiversDataRemains, batchSize)
  console.info(`Receivers remains chunks ${receiversDataRemainsChunks.length}`)

  for (let i = 0; i < receiversDataRemainsChunks.length; i++) {
    const receivers = receiversDataRemainsChunks[i].map(
      (receiversDataRemainsChunk: any) => receiversDataRemainsChunk.address
    )
    const quantities = receiversDataRemainsChunks[i].map(
      (receiversDataRemainsChunk: any) => receiversDataRemainsChunk.quantity
    )
    const senderNativeBalanceBatch = await ethers.provider.getBalance(sender.address)
    console.info(
      `Sending batch ${i + 1}/${receiversDataRemainsChunks.length} sender native balance ${displayAmount(
        senderNativeBalanceBatch
      )}`
    )
    const tx = await onCyberMultiSender.transfer(contract.address, tokenId, receivers, quantities, {
      gasPrice: BigNumber.from(config.networks[network.name].gasPrice),
    })
    console.info(`Tx multi send batch ${i + 1} pending ${tx.hash}`)
    receiversDataRemainsChunks[i].forEach((receiversDataRemainsChunk: any) => {
      const receiverData: any = receiversData.find(
        (receiverData: any) => receiverData.address === receiversDataRemainsChunk.address
      )
      if (!receiverData) {
        throw new Error('Invalid receiver data')
      }
      receiverData.status = 'pending'
    })
    fs.writeFileSync(receiversDataPath, JSON.stringify(receiversData, null, 2))
    const receipt = await tx.wait()

    console.info(`Tx multi send batch ${i + 1} done ${tx.hash}`)
    receiversDataRemainsChunks[i].forEach((receiversDataRemainsChunk: any) => {
      const receiverData: any = receiversData.find(
        (receiverData: any) => receiverData.address === receiversDataRemainsChunk.address
      )
      if (!receiverData) {
        throw new Error('Invalid receiver data')
      }
      receiverData.status = 'done'
    })
    fs.writeFileSync(receiversDataPath, JSON.stringify(receiversData, null, 2))

    const senderNativeBalanceBatchEnd = await ethers.provider.getBalance(sender.address)
    console.info(
      `End batch ${i + 1} sender native balance ${displayAmount(
        senderNativeBalanceBatchEnd
      )} gas used ${receipt.gasUsed.toString()} cost ${displayAmount(
        senderNativeBalanceBatch.sub(senderNativeBalanceBatchEnd),
        4
      )}`
    )
  }
  const senderNativeBalanceEnd = await ethers.provider.getBalance(sender.address)
  console.info(
    `Multi send end sender native balance ${displayAmount(senderNativeBalanceEnd)} cost ${displayAmount(
      senderNativeBalance.sub(senderNativeBalanceEnd),
      4
    )}`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
