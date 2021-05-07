import { ethers, deployments, getNamedAccounts } from 'hardhat'
import { expect } from 'chai'

import { signMintingRequest } from '../lib/utils'

const memory: any = {}

const tokenURI = (uri: string) => `ipfs://${uri}`

describe('OnCyberScenes', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
  })

  beforeEach(async () => {

    memory.namedAccounts = await getNamedAccounts()

    await deployments.fixture()
    memory.deployer = memory.signers[0]
    memory.manager = memory.signers[1]
    memory.other = memory.signers[2]
    memory.other2 = memory.signers[3]
    const contract = await deployments.get('DiamondCyber')
    memory.contract = await ethers.getContractAt(
      contract.abi,
      contract.address,
      memory.deployer
    )
  })

  it('sets up the contract', async () => {
    expect(await memory.contract.totalSupply()).to.eq('0')
    expect(await memory.contract.manager()).to.be.eq(memory.manager.address)
    expect(await memory.contract.isTrustedForwarder(memory.namedAccounts.biconomyForwarder) ).to.be.true
    expect(await memory.contract.minterNonce(memory.other.address) ).to.eq('0')
  })

  it('mint one', async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '1'
    const nonce = '0'
    const signature = await signMintingRequest(
      uri,
      amount,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(uri, amount, signature)

    const tokenId = 0
    expect(await memory.contract.balanceOf(memory.other.address, tokenId)).to.eq(amount)
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('1')
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq(amount)
    expect(await memory.contract.isApprovedForAll(memory.other.address, memory.namedAccounts.opensea) ).to.true

  })

  it('mint more than one', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '1'
    const nonce = '0'
    const signature = await signMintingRequest(
      uri,
      amount,
      nonce,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(uri, amount, signature)

    const tokenId = 0
    expect(
      await memory.contract.balanceOf(memory.other.address, tokenId)
    ).to.eq(amount)
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')
    expect(await memory.contract.isApprovedForAll(memory.other.address, memory.namedAccounts.opensea) ).to.true

    const uri1 = 'Qmsfzefi221ifjzifj1'
    const amount1 = '11'
    const nonce1 = '1'
    const signature1 = await signMintingRequest(
      uri1,
      amount1,
      nonce1,
      memory.other.address,
      memory.manager
    )
    await memory.contract.connect(memory.other).mint(uri1, amount1, signature1)

    const tokenId1 = 1
    expect(
      await memory.contract.balanceOf(memory.other.address, tokenId1)
    ).to.eq(amount1)
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('2')
    expect(await memory.contract.uri(tokenId1)).to.eq(tokenURI(uri1))
    expect(await memory.contract.totalSupply()).to.eq('2')
    expect(await memory.contract.isApprovedForAll(memory.other.address, memory.namedAccounts.opensea) ).to.true

  })

  it('Should failed to get uri of not existing token', async () => {
    await expect(
      memory.contract.connect(memory.other).uri(0)
    ).to.be.revertedWith('ERC1155URIStorage: tokenId not exist')
  })

  it("can't mint with invalid signature", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '1'
    const nonce = '0'
    const invalidSignerSignature = await signMintingRequest(
      uri,
      amount,
      nonce,
      memory.other.address,
      memory.other
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, invalidSignerSignature)
    ).to.be.revertedWith('NM')

    const invalidAccountSignature = await signMintingRequest(
      uri,
      amount,
      nonce,
      memory.manager.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, invalidAccountSignature)
    ).to.be.revertedWith('NM')

    const invalidAmountSignature = await signMintingRequest(
      uri,
      '2',
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, invalidAmountSignature)
    ).to.be.revertedWith('NM')

    const invalidUriSignature = await signMintingRequest(
      'uri',
      amount,
      nonce,
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, invalidUriSignature)
    ).to.be.revertedWith('NM')

    const invalidNonceSignature = await signMintingRequest(
      uri,
      amount,
      '1',
      memory.other.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, invalidNonceSignature)
    ).to.be.revertedWith('NM')
  })
})
