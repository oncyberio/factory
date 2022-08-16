import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { deployments, ethers, getNamedAccounts } from 'hardhat'
import { signCreateDropRequest, signMintRequest } from '../lib/utils'

const memory: any = {}

describe('OnCyberMultiSender', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
  })

  beforeEach(async () => {
    memory.namedAccounts = await getNamedAccounts()
    memory.deployer = memory.signers[0]
    memory.oncyber = memory.signers[1]
    memory.manager = memory.signers[3]
    memory.other = memory.signers[4]
    memory.other1 = memory.signers[5]
    memory.other2 = memory.signers[6]
    await deployments.fixture()
    const onCyberMultiSenderDeployment = await deployments.get('OnCyberMultiSender')
    memory.onCyberMultiSender = await ethers.getContractAt(
      onCyberMultiSenderDeployment.abi,
      onCyberMultiSenderDeployment.address,
      memory.deployer
    )
    const DiamondOnCyberAndFriendsFactoryDeployment = await deployments.get('DiamondOnCyberAndFriendsFactory')
    memory.OnCyberAndFriendsFactory = await ethers.getContractAt(
      DiamondOnCyberAndFriendsFactoryDeployment.abi,
      DiamondOnCyberAndFriendsFactoryDeployment.address,
      memory.deployer
    )

    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
    const price = 0
    const amountCap = 1000
    const shareCyber = 100
    const signatureDrop = await signCreateDropRequest(
      uri,
      timeStart,
      timeEnd,
      BigNumber.from(price),
      amountCap,
      shareCyber,
      memory.other.address,
      0,
      memory.manager
    )
    await memory.OnCyberAndFriendsFactory.connect(memory.other).createDrop(
      uri,
      timeStart,
      timeEnd,
      BigNumber.from(price),
      amountCap,
      shareCyber,
      signatureDrop
    )
    memory.tokenId = 0
    const quantity = 1000
    const signatureMint = await signMintRequest(memory.tokenId, quantity, memory.other.address, 0, memory.manager)
    await memory.OnCyberAndFriendsFactory.connect(memory.other).mint(memory.tokenId, quantity, signatureMint, {
      value: 0,
    })
  })

  it('Should send multiple', async () => {
    expect(await memory.OnCyberAndFriendsFactory.balanceOf(memory.other.address, 0)).to.eq('1000')
    const receivers = [memory.other1.address, memory.other2.address]
    const quantities = [2, 3]
    expect(receivers.length === quantities.length, 'length not match')
    await memory.OnCyberAndFriendsFactory.connect(memory.other).setApprovalForAll(
      memory.onCyberMultiSender.address,
      true
    )
    await memory.onCyberMultiSender
      .connect(memory.other)
      .transfer(memory.OnCyberAndFriendsFactory.address, memory.tokenId, receivers, quantities)
    expect(await memory.OnCyberAndFriendsFactory.balanceOf(memory.other.address, 0)).to.eq('995')
    expect(await memory.OnCyberAndFriendsFactory.balanceOf(memory.other1.address, 0)).to.eq('2')
    expect(await memory.OnCyberAndFriendsFactory.balanceOf(memory.other2.address, 0)).to.eq('3')
  })

  it('Should send mass multiple', async () => {
    expect(await memory.OnCyberAndFriendsFactory.balanceOf(memory.other.address, 0)).to.eq('1000')
    const receivers = []
    const quantities = []
    const countReceivers = 50
    for (let i = 0; i < countReceivers; i++) {
      receivers.push(ethers.Wallet.createRandom().address)
      quantities.push(2)
    }
    await memory.OnCyberAndFriendsFactory.connect(memory.other).setApprovalForAll(
      memory.onCyberMultiSender.address,
      true
    )
    const estimationGas = await memory.onCyberMultiSender
      .connect(memory.other)
      .estimateGas.transfer(memory.OnCyberAndFriendsFactory.address, memory.tokenId, receivers, quantities)
    await memory.onCyberMultiSender
      .connect(memory.other)
      .transfer(memory.OnCyberAndFriendsFactory.address, memory.tokenId, receivers, quantities)
    console.info(`${countReceivers} gasEstimation ${estimationGas} peer address ${estimationGas.div(countReceivers)}`)
    // 50 gasEstimation 6498496 peer address 129969
    // 100 gasEstimation 12896625 peer address 128966
    expect(await memory.OnCyberAndFriendsFactory.balanceOf(memory.other.address, 0)).to.eq('900')
  })

  it('Should send multiple throw when receiver/quantities length mismatch', async () => {
    expect(await memory.OnCyberAndFriendsFactory.balanceOf(memory.other.address, 0)).to.eq('1000')
    const receivers = [memory.other1.address, memory.other2.address]
    const quantities = [2]
    await memory.OnCyberAndFriendsFactory.connect(memory.other).setApprovalForAll(
      memory.onCyberMultiSender.address,
      true
    )
    await expect(
      memory.onCyberMultiSender
        .connect(memory.other)
        .transfer(memory.OnCyberAndFriendsFactory.address, memory.tokenId, receivers, quantities)
    ).to.be.rejectedWith('OnCyberMultiSender: receivers and quantities length mismatch')
  })
})
