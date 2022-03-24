import { ethers, deployments, getNamedAccounts } from 'hardhat'
import { expect } from 'chai'
import { BigNumber, utils } from 'ethers'

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
    memory.contract = await ethers.getContractAt(
      memory.abi,
      contract.address,
      memory.deployer
    )
  })

  describe('CreateDrop', () => {
    it('Should create drop', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 10
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq('0')
      expect(
        await memory.contract.balanceOf(memory.oncyber.address, tokenId)
      ).to.eq('0')
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

      await expect(
        memory.contract.connect(memory.other).getDrop(1)
      ).not.to.be.revertedWith('DNE')

    })

    it('Should create drop fixed price', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          price,
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq('0')
      expect(
        await memory.contract.balanceOf(memory.oncyber.address, tokenId)
      ).to.eq('0')
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

      await expect(
        memory.contract.connect(memory.other).getDrop(1)
      ).not.to.be.revertedWith('DNE')
    })

    it('Should create drop more than one time', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price1 = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price1),
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
          BigNumber.from(price1),
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq('0')
      expect(
        await memory.contract.balanceOf(memory.oncyber.address, tokenId)
      ).to.eq('0')
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart.toString())
      expect(drop.timeEnd).to.eq(timeEnd.toString())
      expect(drop.price).to.eq(price1)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq('0')

      await expect(
        memory.contract.connect(memory.other).getDrop(1)
      ).not.to.be.revertedWith('DNE')

      const uri1 = 'Qmsfzefi221ifjzifj1'
      const timeStart1 = parseInt((Date.now() / 1000).toString())
      const timeEnd1 = parseInt((Date.now() / 1000 + 200).toString())
      const price = 1000
      const amountCap1 = 100
      const shareCyber1 = 5
      const nonce1 = 1
      const signatureDrop1 = await signCreateDropRequest(
        uri1,
        timeStart1,
        timeEnd1,
        BigNumber.from(price),
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
          price,
          amountCap1,
          shareCyber1,
          signatureDrop1
        )

      const tokenId1 = 1
      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId1)
      ).to.eq('0')
      expect(
        await memory.contract.balanceOf(memory.oncyber.address, tokenId1)
      ).to.eq('0')
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq('2')
      expect(await memory.contract.uri(tokenId1)).to.eq(tokenURI(uri1))
      expect(await memory.contract['totalSupply()']()).to.eq('2')

      const drop1 = await memory.contract.getDrop(tokenId1)
      expect(drop1.timeStart).to.eq(timeStart1)
      expect(drop1.timeEnd).to.eq(timeEnd1)
      expect(drop1.price).to.eq(price)
      expect(drop1.amountCap).to.eq(amountCap1)
      expect(drop1.shareCyber).to.eq(shareCyber1)
      expect(drop1.creator).to.eq(memory.other.address)
      expect(drop1.minted).to.eq('0')

      await expect(
        memory.contract.connect(memory.other).getDrop(2)
      ).not.to.be.revertedWith('DNE')
    })

    it('Should create drop with forwarder', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 10
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
        amountCap,
        shareCyber,
        memory.other.address,
        nonce,
        memory.manager
      )
      const contractInterface = new ethers.utils.Interface(memory.abi)
      const functionSignature = contractInterface.encodeFunctionData(
        'createDrop',
        [
          uri,
          timeStart,
          timeEnd,
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop,
        ]
      )

      await memory.biconomyForwarder.sendTransaction({
        to: memory.contract.address,
        data: utils.hexConcat([functionSignature, memory.other.address]),
      })

      const tokenId = 0
      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq('0')
      expect(
        await memory.contract.balanceOf(memory.oncyber.address, tokenId)
      ).to.eq('0')
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

      await expect(
        memory.contract.connect(memory.other).getDrop(1)
      ).not.to.be.revertedWith('DNE')
    });

    it("Can't create drop invalid time start/end", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = 20
      const timeEnd = 10
      const price = 100
      const amountCap = 10
      const shareCyber = 10
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith(
        'reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block'
      )
    })

    it("Create drop price start zero", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 0
      const amountCap = 10
      const shareCyber = 10
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).not.to.be.revertedWith('IP')
    })

    it("Can't create drop invalid share onCyber", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 101
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
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
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDropInvalidManager = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDropInvalidManager
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidCreator = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDropInvalidCreator
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidUrl = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDropInvalidUrl
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidTimeStart = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDropInvalidTimeStart
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidTimeEnd = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDropInvalidTimeEnd
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidShareCyber = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            1,
            signatureDropInvalidShareCyber
          )
      ).to.be.revertedWith('NM')

      const signatureDropInvalidNonce = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
            BigNumber.from(price),
            amountCap,
            shareCyber,
            signatureDropInvalidNonce
          )
      ).to.be.revertedWith('NM')
    })
  })

  describe('Mint', () => {
    it('Should mint ', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0

      const signatureMint = await signMintRequest(
        tokenId,
        1,
        memory.other2.address,
        0,
        memory.manager
      )

      await memory.contract
        .connect(memory.other2)
        .mint(tokenId, 1, signatureMint, {
          value: ethers.utils.parseEther("0.5")
        });

      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq('0')
      expect(
        await memory.contract.balanceOf(memory.other2.address, tokenId)
      ).to.eq('1')

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
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      const signatureMint = await signMintRequest(
        tokenId,
        3,
        memory.other2.address,
        0,
        memory.manager
      )
      await memory.contract
        .connect(memory.other2)
        .mint(tokenId, 3, signatureMint, {
          value: ethers.utils.parseEther("0.5"),
        });

      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq('0')
      expect(
        await memory.contract.balanceOf(memory.other2.address, tokenId)
      ).to.eq('3')
      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other2.address)).to.be.eq('1')

      const signatureMint1 = await signMintRequest(
        tokenId,
        2,
        memory.other3.address,
        0,
        memory.manager
      )
      await memory.contract
        .connect(memory.other3)
        .mint(tokenId, 2, signatureMint1, {
          value: ethers.utils.parseEther("0.1"),
        })
      expect(
        await memory.contract.balanceOf(memory.other3.address, tokenId)
      ).to.eq('2')
      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other2.address)
      ).to.be.eq('1')
      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other3.address)
      ).to.be.eq('1')
      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('2')
    })

    it('Should mint more than one from same account', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 100).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )

      const mintPrice = ethers.utils.parseEther("0.1")

      const tokenId = 0

      const signatureMint = await signMintRequest(
        tokenId,
        4,
        memory.other2.address,
        0,
        memory.manager
      )
      await memory.contract
        .connect(memory.other2)
        .mint(tokenId, 4, signatureMint, {
          value: mintPrice,
        })
      expect(
        await memory.contract.balanceOf(memory.other2.address, tokenId)
      ).to.eq('4')
      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other2.address)
      ).to.be.eq('1')

      const signatureMint1 = await signMintRequest(
        tokenId,
        1,
        memory.other2.address,
        1,
        memory.manager
      )
      await memory.contract
        .connect(memory.other2)
        .mint(tokenId, 1, signatureMint1, {
          value: mintPrice,
        })
      expect(
        await memory.contract.balanceOf(memory.other2.address, tokenId)
      ).to.eq('5')
      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other2.address)
      ).to.be.eq('2')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('2')

    })

    it('Should mint without cap', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 100).toString())
      const price = 100
      const amountCap = 0
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      const mintPrice = ethers.utils.parseEther("0.1")
      const signatureMint = await signMintRequest(
        tokenId,
        1,
        memory.other2.address,
        0,
        memory.manager
      )
      await memory.contract
        .connect(memory.other2)
        .mint(tokenId, 1, signatureMint, {
          value: mintPrice,
        })
      expect(
        await memory.contract.balanceOf(memory.other2.address, tokenId)
      ).to.eq('1')

      const signatureMint1 = await signMintRequest(
        tokenId,
        1,
        memory.other3.address,
        0,
        memory.manager
      )
      await memory.contract
        .connect(memory.other3)
        .mint(tokenId, 1, signatureMint1, {
          value: mintPrice,
        })

      expect(
        await memory.contract.balanceOf(memory.other3.address, tokenId)
      ).to.eq('1')

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq('2')
    })

    it('Should mint throw cap reach', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 100
      const amountCap = 2
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      const mintPrice = ethers.utils.parseEther("0.1")
      const signatureMint = await signMintRequest(
        tokenId,
        3,
        memory.other2.address,
        0,
        memory.manager
      )
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, 3, signatureMint, {
          value: mintPrice,
        })
      ).to.be.revertedWith('CR')
    })

    it('Should mint throw out of time to late', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 - 100).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      const signatureMint = await signMintRequest(
        tokenId,
        1,
        memory.other2.address,
        0,
        memory.manager
      )
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, 1, signatureMint, {
          value: 92,
        })
      ).to.be.revertedWith('OOT')
    })

    it('Should mint throw out of time to early', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 + 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 2000).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )

      const tokenId = 0
      const signatureMint = await signMintRequest(
        tokenId,
        1,
        memory.other2.address,
        0,
        memory.manager
      )
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, 1, signatureMint, {
          value: 92,
        })
      ).to.be.revertedWith('OOT')
    })

    it('Should throw to mint invalid amount', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 100).toString())
      const price = 100
      const amountCap = 0
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0
      const signatureMint = await signMintRequest(
        tokenId,
        1,
        memory.other2.address,
        0,
        memory.manager
      )
      await expect(
        memory.contract.connect(memory.other2).mint(tokenId, 1, signatureMint, {
          value: 1,
        })
      ).to.be.revertedWith('IA')
    })

    it("Can't create drop with invalid signature", async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 100).toString())
      const price = 100
      const amountCap = 0
      const shareCyber = 50
      const nonce = 0
      const signatureDrop = await signCreateDropRequest(
        uri,
        timeStart,
        timeEnd,
        BigNumber.from(price),
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
          BigNumber.from(price),
          amountCap,
          shareCyber,
          signatureDrop
        )
      const tokenId = 0

      const signatureMintInvalidManager = await signMintRequest(
        tokenId,
        3,
        memory.other2.address,
        0,
        memory.other3
      )
      await expect(
        memory.contract
          .connect(memory.other2)
          .mint(tokenId, 2, signatureMintInvalidManager, {
            value: 100000,
          })
      ).to.be.revertedWith('NM')

      const signatureMintInvalidMinter = await signMintRequest(
        tokenId,
        4,
        memory.other3.address,
        0,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other2)
          .mint(tokenId, 8, signatureMintInvalidMinter, {
            value: 100000,
          })
      ).to.be.revertedWith('NM')

      const signatureMintInvalidTokenId = await signMintRequest(
        1234,
        1,
        memory.other2.address,
        0,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other2)
          .mint(tokenId, 1, signatureMintInvalidTokenId, {
            value: 100000,
          })
      ).to.be.revertedWith('NM')

      const signatureMintInvalidNonce = await signMintRequest(
        tokenId,
        1,
        memory.other2.address,
        1,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other2)
          .mint(tokenId, 1, signatureMintInvalidNonce, {
            value: 10000,
          })
      ).to.be.revertedWith('NM')

    })
  })

})
