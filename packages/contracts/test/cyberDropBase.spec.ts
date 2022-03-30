import { expect } from 'chai'
import { BigNumber, utils } from 'ethers'
import { ethers, deployments, getNamedAccounts } from 'hardhat'

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
    memory.contract = await ethers.getContractAt(
      memory.abi,
      contract.address,
      memory.deployer
    )
  })

  describe('DropMintCounter', () => {
    it('Should return zero if drop doesnt exist', async () => {
      expect(
        await memory.contract
          .connect(memory.other)
          .dropMintCounter(0, memory.other.address)
      ).to.be.eq(0x00)
    })

    it('Should get drop mint counter greater than zero if drop exist', async () => {
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
          value: 10000,
        })

      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other2.address)
      ).to.be.eq(0x01)
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
      ).to.eq(0x00)
      expect(
        await memory.contract.balanceOf(memory.oncyber.address, tokenId)
      ).to.eq(0x00)

      expect(await memory.contract.minterNonce(memory.other.address)).to.eq(
        0x01
      )
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq(0x01)

      const drop_exist = await memory.contract.getDrop(tokenId)
      expect(drop_exist.timeStart).to.eq(timeStart)
      expect(drop_exist.timeEnd).to.eq(timeEnd)
      expect(drop_exist.price).to.eq(price)
      expect(drop_exist.amountCap).to.eq(amountCap)
      expect(drop_exist.shareCyber).to.eq(shareCyber)
      expect(drop_exist.creator).to.eq(memory.other.address)
      expect(drop_exist.minted).to.eq(0x00)

      const drop_not_exist = await memory.contract.getDrop(1)
      expect(drop_not_exist.timeStart).to.eq(0x00)
      expect(drop_not_exist.timeEnd).to.eq(0x00)
      expect(drop_not_exist.price).to.eq(0x00)
      expect(drop_not_exist.amountCap).to.eq(0x00)
      expect(drop_not_exist.shareCyber).to.eq(0x00)
      expect(drop_not_exist.creator).to.eq(
        '0x0000000000000000000000000000000000000000'
      )
      expect(drop_not_exist.minted).to.eq(0x00)
    })
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
      ).to.eq(0x00)
      expect(
        await memory.contract.balanceOf(memory.oncyber.address, tokenId)
      ).to.eq(0x00)

      expect(await memory.contract.minterNonce(memory.other.address)).to.eq(
        0x01
      )
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq(0x01)

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.price).to.eq(price)
      expect(drop.minted).to.eq(0x00)
    })

    it('Should create drop with forwarder', async () => {
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
      ).to.eq(0x00)
      expect(
        await memory.contract.balanceOf(memory.oncyber.address, tokenId)
      ).to.eq(0x00)
      expect(await memory.contract.minterNonce(memory.other.address)).to.eq(
        0x01
      )
      expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
      expect(await memory.contract['totalSupply()']()).to.eq(0x01)

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.timeStart).to.eq(timeStart)
      expect(drop.timeEnd).to.eq(timeEnd)
      expect(drop.price).to.eq(price)
      expect(drop.amountCap).to.eq(amountCap)
      expect(drop.shareCyber).to.eq(shareCyber)
      expect(drop.creator).to.eq(memory.other.address)
      expect(drop.minted).to.eq(0x00)
    })

    it('Should throw drop if time start/end invalid', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 + 10).toString())
      const timeEnd = parseInt((Date.now() / 1000).toString())
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

    it('Should not throw drop if price is zero', async () => {
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
      ).not.to.be.revertedWith('IT')
    })

    it('Should throw drop if shareCyber invalid', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 10
      const amountCap = 10
      const shareCyber = 200
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

    it('Should throw drop if signature invalid', async () => {
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

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(1000),
            amountCap,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('NM')

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(price),
            40,
            shareCyber,
            signatureDrop
          )
      ).to.be.revertedWith('NM')

      await expect(
        memory.contract
          .connect(memory.other)
          .createDrop(
            uri,
            timeStart,
            timeEnd,
            BigNumber.from(price),
            amountCap,
            30,
            signatureDrop
          )
      ).to.be.revertedWith('NM')
    })
  })

  describe('Mint', () => {
    it('Should mint', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const quality = 1
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

      const mintPrice = 200

      const otherBalance = await ethers.provider.getBalance(
        memory.other.address
      )
      const oncyberBalance = await ethers.provider.getBalance(
        memory.oncyber.address
      )

      const signatureMint = await signMintRequest(
        tokenId,
        quality,
        memory.other2.address,
        nonce,
        memory.manager
      )

      await memory.contract
        .connect(memory.other2)
        .mint(tokenId, quality, signatureMint, {
          value: mintPrice,
        })

      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq(0x00)

      expect(
        await memory.contract.balanceOf(memory.other2.address, tokenId)
      ).to.eq(0x01)

      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(0x64)
      )

      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(0x64)
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq(0x01)
    })

    it('Should mint with price zero', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 0
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const quality = 1
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

      const mintPrice = 200

      const otherBalance = await ethers.provider.getBalance(
        memory.other.address
      )
      const oncyberBalance = await ethers.provider.getBalance(
        memory.oncyber.address
      )

      const signatureMint = await signMintRequest(
        tokenId,
        quality,
        memory.other2.address,
        nonce,
        memory.manager
      )

      await memory.contract
        .connect(memory.other2)
        .mint(tokenId, quality, signatureMint, {
          value: mintPrice,
        })

      expect(
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq(0x00)

      expect(
        await memory.contract.balanceOf(memory.other2.address, tokenId)
      ).to.eq(0x01)

      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance
      )

      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance
      )

      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq(0x01)
    })

    it('Should throw mint if cap invalid', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 100
      const amountCap = 2
      const shareCyber = 50
      const quality = 3
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
      const mintPrice = 100
      const signatureMint = await signMintRequest(
        tokenId,
        quality,
        memory.other2.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other2)
          .mint(tokenId, quality, signatureMint, {
            value: mintPrice,
          })
      ).to.be.revertedWith('CR')
    })

    it('Should throw mint if time invalid', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 200).toString())
      const timeEnd = parseInt((Date.now() / 1000 - 100).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const quality = 1
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
        quality,
        memory.other2.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other2)
          .mint(tokenId, quality, signatureMint, {
            value: 1000,
          })
      ).to.be.revertedWith('OOT')
    })

    it('Should throw mint if amount invalid', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 0
      const shareCyber = 50
      const quality = 3
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
        quality,
        memory.other2.address,
        nonce,
        memory.manager
      )
      await expect(
        memory.contract
          .connect(memory.other2)
          .mint(tokenId, quality, signatureMint, {
            value: 100,
          })
      ).to.be.revertedWith('IA')
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

      const mintPrice = 200

      const otherBalance = await ethers.provider.getBalance(
        memory.other.address
      )
      const oncyberBalance = await ethers.provider.getBalance(
        memory.oncyber.address
      )

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
        await memory.contract.balanceOf(memory.other.address, tokenId)
      ).to.eq(0x00)
      expect(
        await memory.contract.balanceOf(memory.other2.address, tokenId)
      ).to.eq(0x01)
      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other2.address)
      ).to.be.eq(0x01)

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
      ).to.eq(0x01)
      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other2.address)
      ).to.be.eq(0x01)
      expect(
        await memory.contract.dropMintCounter(tokenId, memory.other3.address)
      ).to.be.eq(0x01)
      const drop = await memory.contract.getDrop(tokenId)
      expect(drop.minted).to.eq(0x02)

      expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
        otherBalance.add(0xc8)
      )

      expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
        oncyberBalance.add(0xc8)
      )
    })

    it('Should throw mint if signature invalid', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 1000).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10000).toString())
      const price = 100
      const amountCap = 10
      const shareCyber = 50
      const nonce = 0
      const quality = 1
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
        quality,
        memory.other2.address,
        nonce,
        memory.manager
      )

      expect(
        memory.contract.connect(memory.other2).mint(tokenId, 2, signatureMint, {
          value: 10000,
        })
      ).to.be.revertedWith('NM')

      const signatureMint1 = await signMintRequest(
        tokenId,
        quality,
        memory.other2.address,
        nonce,
        memory.manager
      )

      expect(
        memory.contract
          .connect(memory.other2)
          .mint(tokenId, quality, signatureMint1, {
            value: 10000,
          })
      ).to.be.revertedWith('NM')
    })
  })
})
