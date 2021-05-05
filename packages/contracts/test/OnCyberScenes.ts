import { ethers } from 'hardhat'
import { expect } from 'chai'

import { signMintingRequest } from '../lib/utils'

const memory: any = {}

const tokenURI = (uri: string) => `ipfs://${uri}`

describe('OnCyberScenes', function () {

  before(async () => {
    memory.signers = await ethers.getSigners()
    memory.Contract = await ethers.getContractFactory('OnCyberScenes')
  })

  beforeEach(async () => {
    memory.deployer = memory.signers[0]
    memory.manager = memory.signers[memory.signers.length -1]
    memory.other = memory.signers[1]
    memory.other2 = memory.signers[2]

    memory.contract = await memory.Contract.deploy(memory.manager.address)
    await memory.contract.deployed()
  })

  it('sets up the contract', async () => {
    expect(await memory.contract.totalSupply()).to.eq('0')
    expect(await memory.contract.manager())
      .to.be.eq(memory.manager.address)
  })

  it('Should change manager', async () => {
    await memory.contract
      .connect(memory.manager)
      .changeManager(memory.other.address)

    expect(await memory.contract.manager() )
      .to.be.eq(memory.other.address)

    await expect(
      memory.contract
        .connect(memory.manager)
        .changeManager(memory.other.address)
    ).to.be.revertedWith('NM')

    await memory.contract
      .connect(memory.other)
      .changeManager(memory.other2.address)

    expect(await memory.contract.manager() )
      .to.be.eq(memory.other2.address)

  })

  it('mint', async () => {

    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '1'
    const signature = await signMintingRequest(
      uri,
      amount,
      memory.other.address,
      memory.manager
    )
    await memory.contract
      .connect(memory.other)
      .mint(uri, amount, signature)

    const tokenId = 0
    expect(await memory.contract.balanceOf(memory.other.address, tokenId) ).to.eq(amount)
    expect(await memory.contract.uri(tokenId)).to.eq(tokenURI(uri))
    expect(await memory.contract.totalSupply()).to.eq('1')

  })

  it('Should failed to get uri of not existing token', async () => {

    await expect(
      memory.contract
        .connect(memory.other)
        .uri(0)
    ).to.be.revertedWith('ERC1155URIStorage: tokenId not exist')

  })

  it("can't mint with invalid signature", async () => {
    const uri = 'Qmsfzefi221ifjzifj'
    const amount = '1'

    const invalidSignerSignature = await signMintingRequest(
      uri,
      amount,
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
      memory.manager.address,
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
      memory.manager.address,
      memory.manager
    )
    await expect(
      memory.contract
        .connect(memory.other)
        .mint(uri, amount, invalidUriSignature)
    ).to.be.revertedWith('NM')

  })

})
