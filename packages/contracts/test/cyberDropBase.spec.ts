import { expect } from 'chai'
import { BigNumber, utils } from 'ethers'
import { deployments, ethers, getNamedAccounts } from 'hardhat'

import { signCreateDropRequest, signMintRequest } from '../lib/utils'

const memory: any = {}

const tokenURI = (uri: string) => `ipfs://${uri}`

describe('CyberDropBase', function () {
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
    const contract = await deployments.diamond.deploy('DiamondCyberDropBase', {
      from: memory.deployer.address,
      owner: memory.deployer.address,
      facets: ['CyberDropBase'],
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

  describe('CreateDrop', () => {
    it('Should create drop', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 2
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('1')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.priceStart).to.eq(priceStart)
      expect(drop.priceEnd).to.eq(priceEnd)
      expect(drop.stepDuration).to.eq(stepDuration)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('1')

      await expect(memory.contract.connect(memory.other).getDrop(1)).to.be.revertedWith('DNE')
    })

    it('Should create drop fixed price', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 100
      const stepDuration = 1
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
        BigNumber.from(price),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(uri, timeStart, timeEnd, price, price, stepDuration, amountCap, shareCyber, signatureDrop)

      const tokenId = 0
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('1')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.priceStart).to.eq(price)
      expect(drop.priceEnd).to.eq(price)
      expect(drop.stepDuration).to.eq(stepDuration)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('1')

      await expect(memory.contract.connect(memory.other).getDrop(1)).to.be.revertedWith('DNE')
    })

    it('Should create drop more than one time', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 2
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('1')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart.toString())
      expect(drop.timeEnd).to.eq(timeEnd.toString())
      expect(drop.priceStart).to.eq(priceStart)
      expect(drop.priceEnd).to.eq(priceEnd)
      expect(drop.stepDuration).to.eq(stepDuration)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('1')

      await expect(memory.contract.connect(memory.other).getDrop(1)).to.be.revertedWith('DNE')

      const uri1 = 'Qmsfzefi221ifjzifj1'
      const timeStart1 = parseInt((Date.now() / 1000).toString())
      const timeEnd1 = parseInt((Date.now() / 1000 + 200).toString())
      const priceStart1 = 1000
      const priceEnd1 = 100
      const stepDuration1 = 20
      const amountCap1 = 100
      const shareCyber1 = 5
      const nonce1 = 1
      const signatureDrop1 = await signCreateDropRequest(
        uri1,
        timeStart1,
        timeEnd1,
        BigNumber.from(priceStart1),
        BigNumber.from(priceEnd1),
        stepDuration1,
        amountCap1,
        shareCyber1,
        memory.other.address,
        nonce1,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri1,
          timeStart1,
          timeEnd1,
          priceStart1,
          priceEnd1,
          stepDuration1,
          amountCap1,
          shareCyber1,
          signatureDrop1
        )

      const tokenId1 = 1
      expect(await memory.contract.balanceOf(memory.other.address, tokenId1)).to.eq('1')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId1)).to.eq('0')
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('2')
      expect(await memory.contract.uri(tokenId1)).to.eq(tokenURI(uri1))
      expect(await memory.contract['totalSupply()']()).to.eq('2')

      const drop1 = await memory.contract.getDrop(tokenId1)
      expect(drop1.timeStart).to.eq(timeStart1)
      expect(drop1.timeEnd).to.eq(timeEnd1)
      expect(drop1.priceStart).to.eq(priceStart1)
      expect(drop1.priceEnd).to.eq(priceEnd1)
      expect(drop1.stepDuration).to.eq(stepDuration1)
      expect(drop1.amountCap).to.eq(amountCap1)
      expect(drop1.shareCyber).to.eq(shareCyber1)
      expect(drop1.creator).to.eq(memory.other.address)
      expect(drop1.minted).to.eq('1')

      await expect(memory.contract.connect(memory.other).getDrop(2)).to.be.revertedWith('DNE')
    })

    it('Should create drop with forwarder', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 2
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      const contractInterface = new ethers.utils.Interface(memory.abi)
      const functionSignature = contractInterface.encodeFunctionData('createDrop', [
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        signatureDrop,
      ])

      await memory.biconomyForwarder.sendTransaction({
        to: memory.contract.address,
        data: utils.hexConcat([functionSignature, memory.other.address]),
      })

      const tokenId = 0
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('1')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.priceStart).to.eq(priceStart)
      expect(drop.priceEnd).to.eq(priceEnd)
      expect(drop.stepDuration).to.eq(stepDuration)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('1')

      await expect(memory.contract.connect(memory.other).getDrop(1)).to.be.revertedWith('DNE')
    })

    it("Can't create drop invalid time start/end", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = 20
      const timeEnd = 10
      const priceStart = 100
      const priceEnd = 100
      const stepDuration = 2
      const amountCap = 10
      const shareCyber = 10
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )

      try {
        await memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDrop
          )
      } catch (error: any) {
        console.error(error)
      }

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWithPanic(0x11)
    })

    it("Can't create drop invalid step duration", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = 80
      const timeEnd = 100
      const priceStart = 1
      const priceEnd = 2
      const stepDuration = 30
      const amountCap = 10
      const shareCyber = 10
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('IT')
    })

    it("Can't create drop invalid step duration zero", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = 80
      const timeEnd = 100
      const priceStart = 1
      const priceEnd = 2
      const stepDuration = 0
      const amountCap = 10
      const shareCyber = 10
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('IT')
    })

    it("Can't create drop price start zero", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 0
      const priceEnd = 0
      const stepDuration = 2
      const amountCap = 10
      const shareCyber = 10
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('IP')
    })

    it("Can't create drop invalid price start/end", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 1
      const priceEnd = 2
      const stepDuration = 2
      const amountCap = 10
      const shareCyber = 10
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('IP')
    })

    it("Can't create drop invalid share onCyber", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 2
      const amountCap = 10
      const shareCyber = 101
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('ISO')
    })

    it("Can't create drop with invalid signature", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 2
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDropInvalidManager = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.other
      )

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDropInvalidManager
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidCreator = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other2.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDropInvalidCreator
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidUrl = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            'invalid_uri',
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDropInvalidUrl
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidTimeStart = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            1,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDropInvalidTimeStart
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidTimeEnd = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeStart + 3,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDropInvalidTimeEnd
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidStep = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            1,
            amountCap,
            shareCyber,
            signatureDropInvalidStep
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidPriceStart = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            10000000,
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDropInvalidPriceStart
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidPriceEnd = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            1,
            stepDuration,
            amountCap,
            shareCyber,
            signatureDropInvalidPriceEnd
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidAmountCap = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            1,
            shareCyber,
            signatureDropInvalidAmountCap
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidShareCyber = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            1,
            signatureDropInvalidShareCyber
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidNonce = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        1000,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(priceStart),
            BigNumber.from(priceEnd),
            stepDuration,
            amountCap,
            shareCyber,
            signatureDropInvalidNonce
          )
      ).to.be.revertedWith('NM')
    })
  })

  describe('getDrop', () => {
    it('Should throw to get drop if not exist', async () => {
      await expect(memory.contract.connect(memory.other).getDrop(0)).to.be.revertedWith('DNE')
      await expect(memory.contract.connect(memory.other).getDrop(123)).to.be.revertedWith('DNE')
    })
  })

  describe('GetPriceFor', () => {
    it('Should get price for', async () => {
      expect(await memory.contract.getPriceFor(10, 1800, 50, 5, 300)).to.be.eq('50')
      expect(await memory.contract.getPriceFor(299, 1800, 50, 5, 300)).to.be.eq('50')
      expect(await memory.contract.getPriceFor(301, 1800, 50, 5, 300)).to.be.eq('42')
      expect(await memory.contract.getPriceFor(600, 1800, 50, 5, 300)).to.be.eq('35')
      expect(await memory.contract.getPriceFor(900, 1800, 50, 5, 300)).to.be.eq('27')
      expect(await memory.contract.getPriceFor(1200, 1800, 50, 5, 300)).to.be.eq('20')
      expect(await memory.contract.getPriceFor(1500, 1800, 50, 5, 300)).to.be.eq('12')
      expect(await memory.contract.getPriceFor(1799, 1800, 50, 5, 300)).to.be.eq('12')
      expect(await memory.contract.getPriceFor(1800, 1800, 50, 5, 300)).to.be.eq('5')
      expect(await memory.contract.getPriceFor(200, 1800, 5, 5, 1)).to.be.eq('5')
      expect(await memory.contract.getPriceFor(900, 1800, 5, 5, 1)).to.be.eq('5')
    })
  })

  describe('GetMintPriceForToken', () => {
    it('Should throw get mint price for token not exist', async () => {
      await expect(memory.contract.getMintPriceForToken(0)).to.be.revertedWith('DNE')
      await expect(memory.contract.getMintPriceForToken(1234)).to.be.revertedWith('DNE')
    })

    it('Should get mint price for token', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 1000).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 200
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      const mintPrice = await memory.contract.getMintPriceForToken(tokenId)
      expect(mintPrice).to.be.eq('100')
    })

    it('Should get mint price for token fixed price', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 1000).toString())
      const priceStart = 100
      const priceEnd = 100
      const stepDuration = 1
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signature = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signature
        )
      const tokenId = 0
      const mintPrice = await memory.contract.getMintPriceForToken(tokenId)
      expect(mintPrice).to.be.eq('100')
    })

    it('Should get mint price for token without cap', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 1000).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 200
      const amountCap = 0
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      const mintPrice = await memory.contract.getMintPriceForToken(tokenId)
      expect(mintPrice).to.be.eq('100')
    })

    it('Should get mint price for token throw when cap reach', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 1000).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 200
      const amountCap = 2
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      const mintPrice = await memory.contract.getMintPriceForToken(tokenId)
      expect(mintPrice).to.be.eq('100')
      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      await memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
        value: mintPrice,
      })
      await expect(memory.contract.getMintPriceForToken(tokenId)).to.be.revertedWith('CR')
    })

    it('Should get mint price for token throw out of time before', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 + 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 500).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 20
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      await expect(memory.contract.getMintPriceForToken(tokenId)).to.be.revertedWith('OOT')
    })

    it('Should get mint price for token throw out of time after', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 500).toString())
      const timeEnd = parseInt((Date.now() / 1000 - 100).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 20
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      await expect(memory.contract.getMintPriceForToken(tokenId)).to.be.revertedWith('OOT')
    })

    it('Should get mint price for token with time spent', async () => {
      const now = Date.now()
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((now / 1000).toString())
      const timeEnd = parseInt((now / 1000 + 1800).toString())
      const priceStart = 50
      const priceEnd = 5
      const stepDuration = 300
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      await ethers.provider.send('evm_increaseTime', [100])
      await ethers.provider.send('evm_mine', [])
      expect(await memory.contract.getMintPriceForToken(tokenId)).to.be.eq('50')
      await ethers.provider.send('evm_increaseTime', [300])
      await ethers.provider.send('evm_mine', [])
      expect(await memory.contract.getMintPriceForToken(tokenId)).to.be.eq('42')
      await ethers.provider.send('evm_increaseTime', [600])
      await ethers.provider.send('evm_mine', [])
      expect(await memory.contract.getMintPriceForToken(tokenId)).to.be.eq('27')
      await ethers.provider.send('evm_increaseTime', [700])
      await ethers.provider.send('evm_mine', [])
      expect(await memory.contract.getMintPriceForToken(tokenId)).to.be.eq('12')
    })
  })

  describe('Mint', () => {
    it('Should mint ', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 300
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
      const tokenId = 0
      const mintPrice = await memory.contract.connect(memory.other2).getMintPriceForToken(tokenId)
      expect(mintPrice).to.be.eq('92')
      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      await memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
        value: mintPrice,
      })

      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('1')
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber))
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('2')
    })

    it('Should mint more than one multiple accounts', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 300
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
      const tokenId = 0
      const mintPrice = await memory.contract.connect(memory.other2).getMintPriceForToken(tokenId)
      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      await memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
        value: mintPrice,
      })

      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('1')
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber))
      )

      const signatureMint1 = await signMintRequest(tokenId, memory.other3.address, 0, memory.manager)
      await memory.contract.connect(memory.other3).mint(tokenId, signatureMint1, {
        value: mintPrice,
      })
      expect(await memory.contract.balanceOf(memory.other3.address, tokenId)).to.eq('1')
      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')
      expect(await memory.contract.dropMintCounter(tokenId, memory.other3.address)).to.be.eq('1')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.mul(2).sub(mintPrice.mul(2).div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.mul(2).div(100 / shareCyber))
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('3')
    })

    it('Should mint more than one from same account', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 100).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 300
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
      const tokenId = 0
      const mintPrice = await memory.contract.connect(memory.other2).getMintPriceForToken(tokenId)

      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      await memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
        value: mintPrice,
      })
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber))
      )

      const signatureMint1 = await signMintRequest(tokenId, memory.other2.address, 1, memory.manager)
      await memory.contract.connect(memory.other2).mint(tokenId, signatureMint1, {
        value: mintPrice,
      })
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('2')
      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('2')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.mul(2).sub(mintPrice.mul(2).div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.mul(2).div(100 / shareCyber))
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('3')
    })

    it('Should mint without cap', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 100).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 300
      const amountCap = 0
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )

      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
      const tokenId = 0
      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      const mintPrice = await memory.contract.connect(memory.other2).getMintPriceForToken(tokenId)
      await memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
        value: mintPrice,
      })
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber))
      )

      const signatureMint1 = await signMintRequest(tokenId, memory.other3.address, 0, memory.manager)
      await memory.contract.connect(memory.other3).mint(tokenId, signatureMint1, {
        value: mintPrice,
      })
      expect(await memory.contract.balanceOf(memory.other3.address, tokenId)).to.eq('1')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.mul(2).sub(mintPrice.mul(2).div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.mul(2).div(100 / shareCyber))
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('3')
    })

    it('Should mint throw cap reach', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 30
      const amountCap = 2
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
      const tokenId = 0
      const mintPrice = await memory.contract.getMintPriceForToken(tokenId)
      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      await memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
        value: mintPrice,
      })
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber))
      )

      const signatureMint1 = await signMintRequest(tokenId, memory.other2.address, 1, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, signatureMint1, {
          value: mintPrice,
        })
      ).to.be.revertedWith('CR')
    })

    it('Should mint throw out of time to late', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 - 100).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 30
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
          value: 92,
        })
      ).to.be.revertedWith('OOT')
    })

    it('Should mint throw out of time to early', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 + 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 2000).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 30
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
          value: 92,
        })
      ).to.be.revertedWith('OOT')
    })

    it('Should throw to mint invalid amount', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 30
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      const signatureMint = await signMintRequest(tokenId, memory.other2.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, signatureMint, {
          value: 1,
        })
      ).to.be.revertedWith('IA')
    })

    it("Can't create drop with invalid signature", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const priceStart = 100
      const priceEnd = 10
      const stepDuration = 30
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(priceStart),
        BigNumber.from(priceEnd),
        stepDuration,
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(priceStart),
          BigNumber.from(priceEnd),
          stepDuration,
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0

      const signatureMintInvalidManager = await signMintRequest(tokenId, memory.other2.address, 0, memory.other3)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, signatureMintInvalidManager, {
          value: 92,
        })
      ).to.be.revertedWith('NM')

      const signatureMintInvalidMinter = await signMintRequest(tokenId, memory.other3.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, signatureMintInvalidMinter, {
          value: 92,
        })
      ).to.be.revertedWith('NM')

      const signatureMintInvalidTokenId = await signMintRequest(1234, memory.other2.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, signatureMintInvalidTokenId, {
          value: 92,
        })
      ).to.be.revertedWith('NM')

      const signatureMintInvalidNonce = await signMintRequest(tokenId, memory.other2.address, 1, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, signatureMintInvalidNonce, {
          value: 92,
        })
      ).to.be.revertedWith('NM')
    })
  })

  describe('DropMintCounter', () => {
    it('Should throw to get drop mint counter if drop doesnt exist', async () => {
      await expect(memory.contract.connect(memory.other).dropMintCounter(0, memory.other.address)).to.be.revertedWith(
        'DNE'
      )
      await expect(memory.contract.connect(memory.other).dropMintCounter(123, memory.other.address)).to.be.revertedWith(
        'DNE'
      )
    })
  })
})
