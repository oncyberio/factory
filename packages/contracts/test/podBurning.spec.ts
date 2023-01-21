import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { deployments, ethers, getNamedAccounts } from 'hardhat'

import { signCreateDropRequest, signMintRequest } from '../lib/utils'

const memory: any = {}

describe('Pod Burning', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
  })

  beforeEach(async () => {
    memory.namedAccounts = await getNamedAccounts()

    await deployments.fixture()
    memory.deployer = memory.signers[0]
    memory.oncyber = memory.signers[1]
    memory.manager = memory.signers[2]
    memory.biconomyForwarder = memory.signers[3]
    memory.other = memory.signers[4]
    memory.other2 = memory.signers[5]
    memory.other3 = memory.signers[6]
    memory.other4 = memory.signers[7]
    const contract = await deployments.diamond.deploy('DiamondCyberDestinationUtility', {
      from: memory.deployer.address,
      owner: memory.deployer.address,
      facets: ['CyberDestinationUtilityFactoryFacet'],
      execute: {
        methodName: 'initialize',
        args: [
          'ipfs://',
          memory.manager.address,
          memory.biconomyForwarder.address,
          memory.namedAccounts.opensea,
          memory.oncyber.address,
        ],
      },
    })
    memory.abi = contract.abi
    memory.contract = await ethers.getContractAt(memory.abi, contract.address, memory.deployer)
  })

  describe('', () => {
    it('shouldnt burn with 0 space pod', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 0
      const amountCap = 40
      const shareCyber = 50

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
      await memory.contract
        .connect(memory.other)
        .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)

      const tokenId = 0

      const signatureMint = await signMintRequest(tokenId, 1, memory.other2.address, 0, memory.manager)

      await memory.contract.connect(memory.other2).mint(tokenId, 1, signatureMint, {
        value: 0,
      })

      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')

      await expect(memory.contract.connect(memory.other2).burnTransfer(1, false)).to.be.revertedWith('NS')
    })

    // it('shouldnt burn with 1 space pods', async () => {
    //   const uri = 'Qmsfzefi221ifjzifj'
    //   const timeStart = parseInt((Date.now() / 1000).toString())
    //   const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    //   const price = 10
    //   const amountCap = 10
    //   const shareCyber = 50
    //   const signatureDrop = await signCreateDropRequest(
    //     uri,
    //     timeStart,
    //     timeEnd,
    //     BigNumber.from(price),
    //     amountCap,
    //     shareCyber,
    //     memory.other.address,
    //     0,
    //     memory.manager
    //   )
    //   await memory.contract
    //     .connect(memory.other)
    //     .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)

    //   const uri1 = 'Qmsfzefi221ifjzifj'
    //   const timeStart1 = parseInt((Date.now() / 1000).toString())
    //   const timeEnd1 = parseInt((Date.now() / 1000 + 100).toString())
    //   const price1 = 0
    //   const amountCap1 = 10
    //   const shareCyber1 = 50
    //   const nonce1 = 1
    //   const signatureDrop1 = await signCreateDropRequest(
    //     uri1,
    //     timeStart1,
    //     timeEnd1,
    //     BigNumber.from(price1),
    //     amountCap1,
    //     shareCyber1,
    //     memory.other.address,
    //     nonce1,
    //     memory.manager
    //   )
    //   await memory.contract
    //     .connect(memory.other)
    //     .createDrop(uri1, timeStart1, timeEnd1, BigNumber.from(price1), amountCap1, shareCyber1, signatureDrop1)

    //   const tokenId = 1

    //   const signatureMint = await signMintRequest(tokenId, 1, memory.other2.address, 0, memory.manager)

    //   await memory.contract.connect(memory.other2).mint(tokenId, 1, signatureMint, {
    //     value: 0,
    //   })

    //   await expect(memory.contract.connect(memory.other2).burnTransfer(1, false)).to.be.revertedWith('NS')
    // })

    // commented because reverts without an error code (er1155 doesnt exist)
    // it('shouldnt burn with 2 space pods', async () => {
    //   const uri = 'Qmsfzefi221ifjzifj'
    //   const timeStart = parseInt((Date.now() / 1000).toString())
    //   const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    //   const price = 10
    //   const amountCap = 10
    //   const shareCyber = 50
    //   const signatureDrop = await signCreateDropRequest(
    //     uri,
    //     timeStart,
    //     timeEnd,
    //     BigNumber.from(price),
    //     amountCap,
    //     shareCyber,
    //     memory.other.address,
    //     0,
    //     memory.manager
    //   )
    //   await memory.contract
    //     .connect(memory.other)
    //     .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)

    //   const uri1 = 'Qmsfzefi221ifjzifj'
    //   const timeStart1 = parseInt((Date.now() / 1000).toString())
    //   const timeEnd1 = parseInt((Date.now() / 1000 + 10).toString())
    //   const price1 = 0
    //   const amountCap1 = 10
    //   const shareCyber1 = 50
    //   const nonce1 = 1
    //   const signatureDrop1 = await signCreateDropRequest(
    //     uri1,
    //     timeStart1,
    //     timeEnd1,
    //     BigNumber.from(price1),
    //     amountCap1,
    //     shareCyber1,
    //     memory.other.address,
    //     nonce1,
    //     memory.manager
    //   )
    //   await memory.contract
    //     .connect(memory.other)
    //     .createDrop(uri1, timeStart1, timeEnd1, BigNumber.from(price1), amountCap1, shareCyber1, signatureDrop1)

    //   const tokenId = 1;

    //   const signatureMint = await signMintRequest(tokenId, 2, memory.other2.address, 0, memory.manager)

    //   await memory.contract.connect(memory.other2).mint(tokenId, 2, signatureMint, {
    //     value: 0,
    //   })

    //   await expect(
    //     memory.contract.connect(memory.other2).burnTransfer(1, false)
    //   ).to.be.revertedWith('NR')
    // })

    // it('shouldnt burn & mint if not correct token', async () => {
    // })

    // it('shouldnt mint if wrong amount', async () => {
    // })

    // it('shouldnt mint if wrong balance loot', async () => {
    // })

    // it('shouldnt if wrong balance spacepods', async () => {
    // })
  })
})
