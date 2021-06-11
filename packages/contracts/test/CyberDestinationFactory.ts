import { ethers, deployments, getNamedAccounts } from 'hardhat'
import { expect } from 'chai'

import { signMintingRequest } from '../lib/utils'

const memory: any = {}

const tokenURI = (uri: string) => `ipfs://${uri}`

describe('CyberDestinationFactory', function () {
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
    const contract = await deployments.get('DiamondCyberDestinationFactory')
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

  it('mint', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '10'
    const amountOncyber = '1'
    const nonce = '0'
    const signature = await signMintingRequest(
      uri,
      amount,
      amountOncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(uri, amount, amountOncyber, signature)

    const tokenId = 0
    expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('9')
    expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('1')
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')
    expect(await memory.contract.isApprovedForAll(memory.other.address, memory.namedAccounts.opensea) ).to.true

  })

  it('mint more than one time', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '7'
    const amountOncyber = '3'
    const nonce = '0'
    const signature = await signMintingRequest(
      uri,
      amount,
      amountOncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(uri, amount, amountOncyber, signature)

    const tokenId = 0
    expect(
      await memory.contract.balanceOf(memory.other.address, tokenId)
    ).to.eq('4')
    expect(
      await memory.contract.balanceOf(memory.oncyber.address, tokenId)
    ).to.eq('3')
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')
    expect(await memory.contract.isApprovedForAll(memory.other.address, memory.namedAccounts.opensea) ).to.true

    const uri1 = 'Qmsfzefi221ifjzifj1'
    const amount1 = '14'
    const amountOncyber1 = '6'
    const nonce1 = '1'
    const signature1 = await signMintingRequest(
      uri1,
      amount1,
      amountOncyber1,
      nonce1,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(uri1, amount1, amountOncyber1, signature1)

    const tokenId1 = 1
    expect(
      await memory.contract.balanceOf(memory.other.address, tokenId1)
    ).to.eq('8')
    expect(
      await memory.contract.balanceOf(memory.oncyber.address, tokenId1)
    ).to.eq('6')
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('2')
    expect(await memory.contract.uri(tokenId1)).to.eq(tokenURI(uri1))
    expect(await memory.contract.totalSupply()).to.eq('2')
    expect(await memory.contract.isApprovedForAll(memory.other.address, memory.namedAccounts.opensea) ).to.true

  })

  it("can't mint invalid amount onCyber", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '10'
    const amountOncyber = '11'
    const nonce = '0'
    const signature = await signMintingRequest(
      uri,
      amount,
      amountOncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(memory.contract.connect(memory.other).mint(uri, amount, amountOncyber, signature) )
      .to.be.revertedWith('IAO')

  })

  it('mint with 0 amount onCyber', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '10'
    const amountOncyber = '0'
    const nonce = '0'
    const signature = await signMintingRequest(
      uri,
      amount,
      amountOncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(uri, amount, amountOncyber, signature)

    const tokenId = 0
    expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq('10')
    expect(await memory.contract.balanceOf(memory.oncyber.address, tokenId)).to.eq('0')
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')
    expect(await memory.contract.isApprovedForAll(memory.other.address, memory.namedAccounts.opensea) ).to.true


  })

  it('Should failed to get uri of not existing token', async () => {
    await expect(
      memory.contract.connect(memory.other).uri(0)
    ).to.be.revertedWith('ERC1155URI: tokenId not exist')
  })

  it("can't mint with invalid signature", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '1'
    const amountOncyber = '1'
    const nonce = '0'
    const invalidSignerSignature = await signMintingRequest(
      uri,
      amount,
      amountOncyber,
      nonce,
      memory.other.address,
      memory.other
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, amountOncyber, invalidSignerSignature)
    ).to.be.revertedWith('NM')

    const invalidAccountSignature = await signMintingRequest(
      uri,
      amount,
      amountOncyber,
      nonce,
      memory.manager.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, amountOncyber, invalidAccountSignature)
    ).to.be.revertedWith('NM')

    const invalidAmountSignature = await signMintingRequest(
      uri,
      '2',
      amountOncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, amountOncyber, invalidAmountSignature)
    ).to.be.revertedWith('NM')

    const invalidAmountOncyberSignature = await signMintingRequest(
      uri,
      amount,
      '33',
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, amountOncyber, invalidAmountOncyberSignature)
    ).to.be.revertedWith('NM')

    const invalidUriSignature = await signMintingRequest(
      'uri',
      amount,
      amountOncyber,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, amountOncyber, invalidUriSignature)
    ).to.be.revertedWith('NM')

    const invalidNonceSignature = await signMintingRequest(
      uri,
      amount,
      amountOncyber,
      '1',
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, amountOncyber, invalidNonceSignature)
    ).to.be.revertedWith('NM')
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
