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
    const contract = await deployments.get('DiamondCyberDestinationUtilityFactory')
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
    expect(await memory.contract.isTrustedForwarder(memory.namedAccounts.biconomyForwarder) ).to.be.true
    expect(await memory.contract.minterNonce(memory.other.address) ).to.eq('0')
  })

  it('Should throw to get drop if not exist', async () => {
    await expect(
      memory.contract.connect(memory.other).getDrop(0)
    ).to.be.revertedWith('drop not exist')
    await expect(
      memory.contract.connect(memory.other).getDrop(123)
    ).to.be.revertedWith('drop not exist')
  })

  it('mint', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000).toString() )
    const time_end = parseInt((Date.now() / 1000  + 10).toString() )
    const price = 100
    const amount_cap = 10
    const share_oncyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    )

    const tokenId = 0
    expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
    expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.time_start).to.eq(time_start)
    expect(drop.time_end).to.eq(time_end)
    expect(drop.share_oncyber).to.eq(share_oncyber)
    expect(drop.price).to.eq(price)
    expect(drop.amount_cap).to.eq(amount_cap)
    expect(drop.minted).to.eq('0')
    expect(drop.creator).to.eq(memory.other.address)

    await expect(
      memory.contract.connect(memory.other).getDrop(1)
    ).to.be.revertedWith('drop not exist')

  })

  it('mint more than one time', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000).toString() )
    const time_end = parseInt((Date.now() / 1000  + 10).toString() )
    const price = 100
    const amount_cap = 10
    const share_oncyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    )

    const tokenId = 0
    expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('0')
    expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.time_start).to.eq(time_start)
    expect(drop.time_end).to.eq(time_end)
    expect(drop.share_oncyber).to.eq(share_oncyber)
    expect(drop.price).to.eq(price)
    expect(drop.amount_cap).to.eq(amount_cap)
    expect(drop.minted).to.eq('0')
    expect(drop.creator).to.eq(memory.other.address)

    await expect(
      memory.contract.connect(memory.other).getDrop(1)
    ).to.be.revertedWith('drop not exist')

    const uri1 = 'Qmsfzefi221ifjzifj1'
    const time_start1 = parseInt((Date.now() / 1000).toString() )
    const time_end1 = parseInt((Date.now() / 1000  + 10).toString() )
    const price1 = 100
    const amount_cap1 = 10
    const share_oncyber1 = 50
    const nonce1 = '1'
    const signature1 = await signMintingUtilityRequest(
      uri1,
      time_start1,
      time_end1,
      price1,
      amount_cap1,
      share_oncyber1,
      nonce1,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(
      uri1,
      time_start1,
      time_end1,
      price1,
      amount_cap1,
      share_oncyber1,
      signature1
    )

    const tokenId1 = 1
    expect(await memory.contract.balanceOf(memory.other.address, tokenId1)).to.eq('0')
    expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId1)).to.eq('0')
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('2')
    expect(await memory.contract.uri(tokenId1)).to.eq(tokenURI(uri1))
    expect(await memory.contract.totalSupply()).to.eq('2')

    const drop1 = await memory.contract.getDrop(tokenId1)
    expect(drop1.time_start).to.eq(time_start)
    expect(drop1.time_end).to.eq(time_end)
    expect(drop1.share_oncyber).to.eq(share_oncyber)
    expect(drop1.price).to.eq(price)
    expect(drop1.amount_cap).to.eq(amount_cap)
    expect(drop1.minted).to.eq('0')
    expect(drop1.creator).to.eq(memory.other.address)

    await expect(
      memory.contract.connect(memory.other).getDrop(2)
    ).to.be.revertedWith('drop not exist')

  })

  it("can't mint invalid share onCyber", async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000).toString() )
    const time_end = parseInt((Date.now() / 1000  + 10).toString() )
    const price = 100
    const amount_cap = 10
    const share_oncyber = 101
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )

    await expect(memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    ) ).to.be.revertedWith('ISO')

  })

  it("can't mint invalid time start/end", async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = 2
    const time_end = 1
    const price = 100
    const amount_cap = 10
    const share_oncyber = 10
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )

    await expect(memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    ) ).to.be.revertedWith('IT')

  })

  it('Should failed to get uri of not existing token', async () => {
    await expect(
      memory.contract.connect(memory.other).uri(0)
    ).to.be.revertedWith('ERC1155URI: tokenId not exist')
  })

  it("can't mint with invalid signature", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000).toString() )
    const time_end = parseInt((Date.now() / 1000  + 10).toString() )
    const price = 100
    const amount_cap = 10
    const share_oncyber = 50
    const nonce = '0'
    const invalidSignerSignature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.other
    )

    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          time_start,
          time_end,
          price,
          amount_cap,
          share_oncyber,
          invalidSignerSignature
        )
    ).to.be.revertedWith('NM')

    const invalidAccountSignature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.manager.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          time_start,
          time_end,
          price,
          amount_cap,
          share_oncyber,
          invalidAccountSignature
        )
    ).to.be.revertedWith('NM')

    const invalidUriSignature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          'invalid_uri',
          time_start,
          time_end,
          price,
          amount_cap,
          share_oncyber,
          invalidUriSignature
        )
    ).to.be.revertedWith('NM')

    const invalidTimeStartSignature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
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
          time_end,
          price,
          amount_cap,
          share_oncyber,
          invalidTimeStartSignature
        )
    ).to.be.revertedWith('NM')

    const invalidTimeEndSignature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          time_start,
          time_start + 1,
          price,
          amount_cap,
          share_oncyber,
          invalidTimeEndSignature
        )
    ).to.be.revertedWith('NM')

    const invalidPriceSignature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          time_start,
          time_end,
          1,
          amount_cap,
          share_oncyber,
          invalidPriceSignature
        )
    ).to.be.revertedWith('NM')

    const invalidAmountCapSignature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          time_start,
          time_end,
          price,
          1,
          share_oncyber,
          invalidAmountCapSignature
        )
    ).to.be.revertedWith('NM')

    const invalidShareOncyberSignature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(
          uri,
          time_start,
          time_end,
          price,
          amount_cap,
          1,
          invalidShareOncyberSignature
        )
    ).to.be.revertedWith('NM')

  })

  it('MintEdition', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000 - 100).toString() )
    const time_end = parseInt((Date.now() / 1000  + 10).toString() )
    const price = 1000
    const amount_cap = 10
    const share_oncyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    )
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
    const tokenId = 0
    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price
    })
    expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(otherBalance.add('500'))
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(oncyberBalance.add('500'))

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.minted).to.eq('1')

  })

  it('MintEdition more than one', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000 - 100).toString() )
    const time_end = parseInt((Date.now() / 1000  + 10).toString() )
    const price = 1000
    const amount_cap = 10
    const share_oncyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    )
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
    const tokenId = 0

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price
    })
    expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(otherBalance.add('500'))
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(oncyberBalance.add('500'))

    await memory.contract.connect(memory.other3).mintEdition(tokenId, {
      value: price
    })
    expect(await memory.contract.balanceOf(memory.other3.address, tokenId)).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(otherBalance.add('500').add('500'))
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(oncyberBalance.add('500').add('500'))

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.minted).to.eq('2')
  })

  it('MintEdition more than one from same account', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000 - 100).toString() )
    const time_end = parseInt((Date.now() / 1000  + 10).toString() )
    const price = 1000
    const amount_cap = 10
    const share_oncyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    )
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
    const tokenId = 0

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price
    })
    expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(otherBalance.add('500'))
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(oncyberBalance.add('500'))

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price
    })
    expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('2')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(otherBalance.add('500').add('500'))
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(oncyberBalance.add('500').add('500'))

    const drop = await memory.contract.getDrop(tokenId)
    expect(drop.minted).to.eq('2')
  })

  it('MintEdition throw out of time', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000 - 100).toString() )
    const time_end = parseInt((Date.now() / 1000  - 10).toString() )
    const price = 1000
    const amount_cap = 10
    const share_oncyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    )

    const tokenId = 0

    await expect(memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price
    })).to.be.revertedWith('out of time')
  })

  it('MintEdition throw invalid amount', async () => {})

  it('MintEdition without cap', async () => {})

  it('MintEdition throw cap reach', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const time_start = parseInt((Date.now() / 1000 - 100).toString() )
    const time_end = parseInt((Date.now() / 1000  + 10).toString() )
    const price = 1000
    const amount_cap = 1
    const share_oncyber = 50
    const nonce = '0'
    const signature = await signMintingUtilityRequest(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(
      uri,
      time_start,
      time_end,
      price,
      amount_cap,
      share_oncyber,
      signature
    )
    const otherBalance = await ethers.provider.getBalance(memory.other.address)
    const oncyberBalance = await ethers.provider.getBalance(memory.oncyber.address)
    const tokenId = 0

    await memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price
    })
    expect(await memory.contract.balanceOf(memory.other2.address, tokenId)).to.eq('1')
    expect(await ethers.provider.getBalance(memory.other.address)).to.eq(otherBalance.add('500'))
    expect(await ethers.provider.getBalance(memory.oncyber.address)).to.eq(oncyberBalance.add('500'))

    // await memory.contract.connect(memory.other2).mintEdition(tokenId, {
    //   value: price
    // })

    await expect(memory.contract.connect(memory.other2).mintEdition(tokenId, {
      value: price
    })).to.be.revertedWith('cap reach')
  })

  it('Should owner initialise', async () => {

    await memory.contract
      .connect(memory.deployer)
      .initialize('new_uri', memory.other.address, memory.other2.address, memory.other3.address, memory.other4.address)
    expect(await memory.contract.manager()).to.be.eq(memory.other.address)
    expect(await memory.contract.isTrustedForwarder(memory.other2.address) ).to.be.true

    await expect(
      memory.contract
        .connect(memory.other)
        .initialize('new_uri', memory.other.address, memory.other2.address, memory.other3.address, memory.other4.address)
    ).to.be.revertedWith('NO')

  })

})
