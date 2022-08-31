import { expect } from 'chai'
import { BigNumber, utils } from 'ethers'
import { deployments, ethers, getNamedAccounts } from 'hardhat'

import { signCreateDropRequest, signMintRequest, tokenURI } from '../lib/utils'

const memory: any = {}

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
      const price = 10
      const amountCap = 10
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
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')

      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.price).to.eq(price)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('0')

      await expect(memory.contract.connect(memory.other).getDrop(1)).to.be.revertedWith('DNE')
    })

    it('Should create drop price start zero', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 0
      const amountCap = 10
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
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')

      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.price).to.eq(price)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('0')
    })

    it('Should create drop more than one time', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 10
      const amountCap = 10
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
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')

      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.price).to.eq(price)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('0')

      await expect(memory.contract.connect(memory.other).getDrop(1)).to.be.revertedWith('DNE')

      const uri1 = 'Qmsfzefi221ifjzifj'
      const timeStart1 = parseInt((Date.now() / 1000).toString())
      const timeEnd1 = parseInt((Date.now() / 1000 + 10).toString())
      const price1 = 10
      const amountCap1 = 10
      const shareCyber1 = 50
      const nonce1 = 1
      const signatureDrop1 = await signCreateDropRequest(
        uri1,
        timeStart1,
        timeEnd1,
        BigNumber.from(price1),
        amountCap1,
        shareCyber1,
        memory.other.address,
        nonce1,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(uri1, timeStart1, timeEnd1, BigNumber.from(price1), amountCap1, shareCyber1, signatureDrop1)

      const tokenId1 = 1
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')

      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('2')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('2')

      const drop1 = await memory.contract.getDrop(tokenId1)
      expect(drop1.timeStart).to.eq(timeStart1)
      expect(drop1.timeEnd).to.eq(timeEnd1)
      expect(drop1.price).to.eq(price1)
      expect(drop1.amountCap).to.eq(amountCap1)
      expect(drop1.shareCyber).to.eq(shareCyber1)
      expect(drop1.creator).to.eq(memory.other.address)
      expect(drop1.minted).to.eq('0')
    })

    it('Should create drop with forwarder', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 100
      const amountCap = 10
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
      const contractInterface = new ethers.utils.Interface(memory.abi)
      const functionSignature = contractInterface.encodeFunctionData('createDrop', [
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
        amountCap,
        shareCyber,
        signatureDrop,
      ])

      await memory.biconomyForwarder.sendTransaction({
        to: memory.contract.address,
        data: utils.hexConcat([functionSignature, memory.other.address]),
      })

      const tokenId = 0
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.price).to.eq(price)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('0')

      await expect(memory.contract.connect(memory.other).getDrop(1)).to.be.revertedWith('DNE')
    })

    it("Can't create drop invalid time start/end", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = 20
      const timeEnd = 10
      const price = 100
      const amountCap = 10
      const shareCyber = 10
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

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)
      ).to.be.revertedWithPanic(0x11)
    })

    it("Can't create drop invalid share onCyber", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 10
      const amountCap = 10
      const shareCyber = 200
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

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)
      ).to.be.revertedWith('ISO')
    })

    it("Can't create drop invalid amount cap", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 10
      const amountCap = 0
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

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDrop)
      ).to.be.revertedWith('IAC')
    })

    it("Can't create drop with invalid signature", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 10
      const amountCap = 10
      const shareCyber = 50

      // Invalid manager
      const signatureDropInvalidManager = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
        amountCap,
        shareCyber,
        memory.other.address,
        0,
        memory.other
      )

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDropInvalidManager
          )
      ).to.be.revertedWith('NM')

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

      // Invalid creator
      await expect(
        memory.contract
          .connect(memory.other2)
          .createDrop(
            'Rmsfzefi221ifjzifr',
            timeStart,
            timeEnd,
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('NM')

      // Invalid URI
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            'Rmsfzefi221ifjzifr',
            timeStart,
            timeEnd,
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('NM')

      // Invalid time start
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            parseInt((Date.now() / 1000 - 10).toString()),
            timeEnd,
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('NM')

      // Invalid time end
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            parseInt((Date.now() / 1000 + 20).toString()),
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('NM')

      // Invalid price
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(uri, timeStart, timeEnd, BigNumber.from(1000), amountCap, shareCyber, signatureDrop)
      ).to.be.revertedWith('NM')

      // Invalid amount cap
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), 40, shareCyber, signatureDrop)
      ).to.be.revertedWith('NM')

      // Invalid share oncyber
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, 30, signatureDrop)
      ).to.be.revertedWith('NM')

      // Invalid nonce
      const signatureDropInvalidNonce = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
        amountCap,
        shareCyber,
        memory.other.address,
        123,
        memory.other
      )
      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(uri, timeStart, timeEnd, BigNumber.from(price), amountCap, shareCyber, signatureDropInvalidNonce)
      ).to.be.revertedWith('NM')
    })
  })

  describe('GetDrop', () => {
    it('Should get drop', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 10
      const amountCap = 10
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

      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')

      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.price).to.eq(price)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq(0x00)
    })

    it('Should throw error if drop does not exist', async () => {
      await expect(memory.contract.getDrop(0)).to.be.revertedWith('DNE')
      await expect(memory.contract.getDrop(123)).to.be.revertedWith('DNE')
    })
  })

  describe('Mint', () => {
    it('Should mint one', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 10
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

      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
      const tokenId = 0
      const quantity = 1
      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)

      const mintPrice = BigNumber.from(quantity).mul(price)
      await memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint, {
        value: mintPrice,
      })

      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber))
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('1')
    })

    it('Should mint more than one multiple accounts', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 10
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
      const quantity = 1
      const mintPrice = BigNumber.from(quantity).mul(price)

      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)

      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)
      await memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint, {
        value: mintPrice,
      })

      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')

      const signatureMint1 = await signMintRequest(tokenId, 1, memory.other3.address, 0, memory.manager)
      await memory.contract.connect(memory.other3).mint(tokenId, 1, signatureMint1, {
        value: mintPrice,
      })
      expect(await memory.contract.balanceOf(memory.other3.address, tokenId)).to.eq('1')
      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')

      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)).mul(2))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber).mul(2))
      )
      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('2')
    })

    it('Should mint more than one from same account in multiple tx', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 10
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

      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
      const tokenId = 0
      const quantity = 1
      const mintPrice = BigNumber.from(quantity).mul(price)
      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)

      await memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint, {
        value: mintPrice,
      })
      const signatureMint1 = await signMintRequest(tokenId, quantity, memory.other2.address, 1, memory.manager)

      await memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint1, {
        value: mintPrice,
      })
      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('2')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)).mul(2))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber).mul(2))
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('2')
    })

    it('Should mint more than one from same account in one tx', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 10
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

      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
      const tokenId = 0
      const quantity = 4
      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)

      const mintPrice = BigNumber.from(quantity).mul(price)
      await memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint, {
        value: mintPrice,
      })

      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('4')
      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(mintPrice.sub(mintPrice.div(100 / shareCyber)))
      )
      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(mintPrice.div(100 / shareCyber))
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('4')
    })

    it('Should mint with price zero', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 0
      const amountCap = 10
      const shareCyber = 50
      const quantity = 1
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

      const otherBalance = await ethers.provider.getBalance(memory.other.address)
      const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)

      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)

      await memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint)

      expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')

      expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')

      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(otherBalance)

      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(oncyberBalance)

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('1')
    })

    it('Should mint throw cap reach', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 100
      const amountCap = 2
      const shareCyber = 50
      const quantity = 3
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
      const mintPrice = BigNumber.from(quantity).mul(price)
      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint, {
          value: mintPrice,
        })
      ).to.be.revertedWith('CR')
    })

    it('Should mint throw out of time to late', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 - 500).toString())
      const price = 100
      const amountCap = 100
      const shareCyber = 50
      const quantity = 1
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
      const mintPrice = BigNumber.from(quantity).mul(price)
      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint, {
          value: mintPrice,
        })
      ).to.be.revertedWith('OOT')
    })

    it('Should mint throw out of time to early', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 + 500).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 1000).toString())
      const price = 100
      const amountCap = 100
      const shareCyber = 50
      const quantity = 1
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
      const mintPrice = BigNumber.from(quantity).mul(price)
      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint, {
          value: mintPrice,
        })
      ).to.be.revertedWith('OOT')
    })

    it('Should throw to mint invalid amount', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 100).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const quantity = 1
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
      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMint, {
          value: 123,
        })
      ).to.be.revertedWith('IA')
    })

    it("Can't mint with invalid signature", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 100).toString())
      const price = 100
      const amountCap = 10
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
        .createDrop(uri, timeStart, timeEnd, price, amountCap, shareCyber, signatureDrop)
      const tokenId = 0
      const quantity = 1
      const mintPrice = BigNumber.from(price).mul(quantity)

      // Invalid manager
      const signatureMintInvalidManager = await signMintRequest(
        tokenId,
        quantity,
        memory.other2.address,
        0,
        memory.other3
      )
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMintInvalidManager, {
          value: mintPrice,
        })
      ).to.be.revertedWith('NM')

      const signatureMint = await signMintRequest(tokenId, quantity, memory.other2.address, 0, memory.manager)
      // Invalid minter
      await expect(
        memory.contract.connect(memory.other).mint(tokenId, quantity, signatureMint, {
          value: mintPrice,
        })
      ).to.be.revertedWith('NM')

      // Invalid token id
      const signatureDrop1 = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
        amountCap,
        shareCyber,
        memory.other.address,
        1,
        memory.manager
      )
      await memory.contract
        .connect(memory.other)
        .createDrop(uri, timeStart, timeEnd, price, amountCap, shareCyber, signatureDrop1)
      await expect(
        memory.contract.connect(memory.other2).mint(1, quantity, signatureMint, {
          value: mintPrice,
        })
      ).to.be.revertedWith('NM')

      // Invalid quantity
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, 2, signatureMint, {
          value: BigNumber.from(price).mul(2),
        })
      ).to.be.revertedWith('NM')

      // Invalid nonce
      const signatureMintInvalidNonce = await signMintRequest(
        tokenId,
        quantity,
        memory.other2.address,
        1,
        memory.manager
      )
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, quantity, signatureMintInvalidNonce, {
          value: mintPrice,
        })
      ).to.be.revertedWith('NM')
    })
  })

  describe('DropMintCounter', () => {
    it('Should get drop mint counter greater than zero if drop exist', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 10
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

      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('0')

      const signatureMint = await signMintRequest(tokenId, 1, memory.other2.address, 0, memory.manager)

      await memory.contract.connect(memory.other2).mint(tokenId, 1, signatureMint, {
        value: 100,
      })
      expect(await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')
    })

    it('Should throw to get drop mint counter if drop doesnt exist', async () => {
      await expect(memory.contract.connect(memory.other).dropMintCounter(0, memory.other.address)).to.be.revertedWith(
        'DNE'
      )
    })
  })

})
