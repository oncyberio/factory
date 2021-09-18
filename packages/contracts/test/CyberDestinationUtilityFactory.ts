import { ethers, deployments, getNamedAccounts } from 'hardhat'
import { expect } from 'chai'

import { signMintingUtilityRequest } from '../lib/utils'

const memory: any = {}

const tokenURI = (uri: string) => `ipfs://${uri}`

describe('CyberDestinationUtilityFactory', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
  })

  beforeEach(async () => {
    memory.namedAccounts = await getNamedAccounts()

    await deployments.fixture()
    memory.deployer = memory.signers[0]
    memory.manager = memory.signers[1]
    memory.oncyber = memory.signers[2]
    memory.other = memory.signers[3]
    memory.other2 = memory.signers[4]
    memory.other3 = memory.signers[5]
    memory.other4 = memory.signers[6]
    const contract = await deployments.get(
      'DiamondCyberDestinationUtilityFactory'
    )
    memory.contract = await ethers.getContractAt(
      contract.abi,
      contract.address,
      memory.deployer
    )
  })

  it('sets up the contract', async () => {
    expect(await memory.contract.totalSupply()).to.eq('0')
    expect(await memory.contract.manager()).to.be.eq(memory.manager.address)
    expect(await memory.contract.oncyber()).to.be.eq(memory.oncyber.address)
    expect(
      await memory.contract.isTrustedForwarder(
        memory.namedAccounts.biconomyForwarder
      )
    ).to.be.true
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('0')
  })

  it('Should throw to get drop if not exist', async () => {
    await expect(
      memory.contract.connect(memory.other).getDrop(0)
    ).to.be.revertedWith('DNE')
    await expect(
      memory.contract.connect(memory.other).getDrop(123)
    ).to.be.revertedWith('DNE')
  })

  it('mint', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 100
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)

    const tokenId = 0
    expect(
      await memory.contract.balanceOf(memory.other.address, tokenId)
    ).to.eq('0')
    expect(
      await memory.contract.balanceOf(memory.oncyber.address, tokenId)
    ).to.eq('0')
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.timeStart).to.eq(timeStart)
    expect(drop.timeEnd).to.eq(timeEnd)
    expect(drop.shareCyber).to.eq(shareCyber)
    expect(drop.price).to.eq(price)
    expect(drop.amountCap).to.eq(amountCap)
    expect(drop.minted).to.eq('0')
    expect(drop.creator).to.eq(memory.other.address)

    await expect(
      memory.contract.connect(memory.other).getDrop(1)
    ).to.be.revertedWith('DNE')
  })

  it('mint more than one time', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 100
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)

    const tokenId = 0
    expect(
      await memory.contract.balanceOf(memory.other.address, tokenId)
    ).to.eq('0')
    expect(
      await memory.contract.balanceOf(memory.oncyber.address, tokenId)
    ).to.eq('0')
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.timeStart).to.eq(timeStart.toString())
    expect(drop.timeEnd).to.eq(timeEnd.toString())
    expect(drop.shareCyber).to.eq(shareCyber)
    expect(drop.price).to.eq(price)
    expect(drop.amountCap).to.eq(amountCap)
    expect(drop.minted).to.eq('0')
    expect(drop.creator).to.eq(memory.other.address)

    await expect(
      memory.contract.connect(memory.other).getDrop(1)
    ).to.be.revertedWith('DNE')

    const uri1 = 'Qmsfzefi221ifjzifj1'
    const timeStart1 = parseInt((Date.now() / 1000).toString())
    const timeEnd1 = parseInt((Date.now() / 1000 + 10).toString())
    const price1 = 100
    const amountCap1 = 10
    const shareCyber1 = 50
    const nonce1 = '1'
    const signature1 = await signMintingUtilityRequest(
      uri1,
      timeStart1,
      timeEnd1,
      price1,
      amountCap1,
      shareCyber1,
      nonce1,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(
        uri1,
        timeStart1,
        timeEnd1,
        price1,
        amountCap1,
        shareCyber1,
        signature1
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
    expect(await memory.contract.totalSupply()).to.eq('2')

    const drop1 = await memory.contract.getDrop(tokenId1)
    expect(drop1.timeStart).to.eq(timeStart)
    expect(drop1.timeEnd).to.eq(timeEnd)
    expect(drop1.shareCyber).to.eq(shareCyber)
    expect(drop1.price).to.eq(price)
    expect(drop1.amountCap).to.eq(amountCap)
    expect(drop1.minted).to.eq('0')
    expect(drop1.creator).to.eq(memory.other.address)

    await expect(
      memory.contract.connect(memory.other).getDrop(2)
    ).to.be.revertedWith('DNE')
  })

  it("can't mint invalid share onCyber", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 100
    const amountCap = 10
    const shareCyber = 101
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )

    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)
    ).to.be.revertedWith('ISO')
  })

  it("can't mint invalid time start/end", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = 2
    const timeEnd = 1
    const price = 100
    const amountCap = 10
    const shareCyber = 10
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )

    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)
    ).to.be.revertedWith('IT')
  })

  it('Should failed to get uri of not existing token', async () => {
    await expect(
      memory.contract.connect(memory.other).uri(0)
    ).to.be.revertedWith('ERC1155URI: tokenId not exist')
  })

  it("can't mint with invalid signature", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 100
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const invalidSignerSignature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.other
    )

    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          timeStart,
          timeEnd,
          price,
          amountCap,
          shareCyber,
          invalidSignerSignature
        )
    ).to.be.revertedWith('NM')

    const invalidAccountSignature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.manager.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          timeStart,
          timeEnd,
          price,
          amountCap,
          shareCyber,
          invalidAccountSignature
        )
    ).to.be.revertedWith('NM')

    const invalidUriSignature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          'invalid_uri',
          timeStart,
          timeEnd,
          price,
          amountCap,
          shareCyber,
          invalidUriSignature
        )
    ).to.be.revertedWith('NM')

    const invalidTimeStartSignature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          1,
          timeEnd,
          price,
          amountCap,
          shareCyber,
          invalidTimeStartSignature
        )
    ).to.be.revertedWith('NM')

    const invalidTimeEndSignature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          timeStart,
          timeStart + 1,
          price,
          amountCap,
          shareCyber,
          invalidTimeEndSignature
        )
    ).to.be.revertedWith('NM')

    const invalidPriceSignature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          timeStart,
          timeEnd,
          1,
          amountCap,
          shareCyber,
          invalidPriceSignature
        )
    ).to.be.revertedWith('NM')

    const invalidAmountCapSignature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          timeStart,
          timeEnd,
          price,
          1,
          shareCyber,
          invalidAmountCapSignature
        )
    ).to.be.revertedWith('NM')

    const invalidshareCyberSignature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          timeStart,
          timeEnd,
          price,
          amountCap,
          1,
          invalidshareCyberSignature
        )
    ).to.be.revertedWith('NM')
  })

  it('MintEdition', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 - 100).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 1000
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(
      memory.oncyber.address
    )
    const tokenId = 0
    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price,
    })
    expect(
      await memory.contract.balanceOf(memory.other2.address, tokenId)
    ).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
      otherBalance.add('500')
    )
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
      oncyberBalance.add('500')
    )

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.minted).to.eq('1')
  })

  it('MintEdition more than one', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 - 100).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 1000
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(
      memory.oncyber.address
    )
    const tokenId = 0

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price,
    })
    expect(
      await memory.contract.balanceOf(memory.other2.address, tokenId)
    ).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
      otherBalance.add('500')
    )
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
      oncyberBalance.add('500')
    )

    await memory.contract.connect(memory.other3).mintEdition(tokenId, {
      value: price,
    })
    expect(
      await memory.contract.balanceOf(memory.other3.address, tokenId)
    ).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
      otherBalance.add('500').add('500')
    )
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
      oncyberBalance.add('500').add('500')
    )

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.minted).to.eq('2')
  })

  it('MintEdition without cap', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 - 100).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 1000
    const amountCap = 0
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(
      memory.oncyber.address
    )
    const tokenId = 0

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price,
    })
    expect(
      await memory.contract.balanceOf(memory.other2.address, tokenId)
    ).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
      otherBalance.add('500')
    )
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
      oncyberBalance.add('500')
    )

    await memory.contract.connect(memory.other3).mintEdition(tokenId, {
      value: price,
    })
    expect(
      await memory.contract.balanceOf(memory.other3.address, tokenId)
    ).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
      otherBalance.add('500').add('500')
    )
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
      oncyberBalance.add('500').add('500')
    )

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.minted).to.eq('2')
  })

  it('MintEdition more than one from same account', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 - 100).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 1000
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(
      memory.oncyber.address
    )
    const tokenId = 0

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price,
    })
    expect(
      await memory.contract.balanceOf(memory.other2.address, tokenId)
    ).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
      otherBalance.add('500')
    )
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
      oncyberBalance.add('500')
    )

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price,
    })
    expect(
      await memory.contract.balanceOf(memory.other2.address, tokenId)
    ).to.eq('2')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
      otherBalance.add('500').add('500')
    )
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
      oncyberBalance.add('500').add('500')
    )

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.minted).to.eq('2')
  })

  it('MintEdition throw out of time to late', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 - 100).toString())
    const timeEnd = parseInt((Date.now() / 1000 - 10).toString())
    const price = 1000
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)

    const tokenId = 0

    await expect(
      memory.contract.connect(memory.other2).mintEdition(tokenId, {
        value: price,
      })
    ).to.be.revertedWith('OOT')
  })

  it('MintEdition throw out of time to early', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 + 1000).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 2000).toString())
    const price = 1000
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)

    const tokenId = 0

    await expect(
      memory.contract.connect(memory.other2).mintEdition(tokenId, {
        value: price,
      })
    ).to.be.revertedWith('OOT')
  })

  it('MintEdition throw invalid amount', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 - 100).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 1000
    const amountCap = 10
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)
    const tokenId = 0
    await expect(
      memory.contract.connect(memory.other2).mintEdition(tokenId, {
        value: 1,
      })
    ).to.be.revertedWith('IA')
  })

  it('MintEdition throw cap reach', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const timeStart = parseInt((Date.now() / 1000 - 100).toString())
    const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
    const price = 1000
    const amountCap = 1
    const shareCyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      timeStart,
      timeEnd,
      price,
      amountCap,
      shareCyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, timeStart, timeEnd, price, amountCap, shareCyber, signature)
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(
      memory.oncyber.address
    )
    const tokenId = 0

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price,
    })
    expect(
      await memory.contract.balanceOf(memory.other2.address, tokenId)
    ).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(
      otherBalance.add('500')
    )
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(
      oncyberBalance.add('500')
    )

    await expect(
      memory.contract.connect(memory.other2).mintEdition(tokenId, {
        value: price,
      })
    ).to.be.revertedWith('CR')
  })

  it('Should owner initialise', async () => {
    await memory.contract
      .connect(memory.deployer)
      .initialize(
        'new_uri',
        memory.other.address,
        memory.other2.address,
        memory.other3.address,
        memory.other4.address
      )
    expect(await memory.contract.manager()).to.be.eq(memory.other.address)
    expect(await memory.contract.isTrustedForwarder(memory.other2.address)).to
      .be.true

    await expect(
      memory.contract
        .connect(memory.other)
        .initialize(
          'new_uri',
          memory.other.address,
          memory.other2.address,
          memory.other3.address,
          memory.other4.address
        )
    ).to.be.revertedWith('NO')
  })
})
