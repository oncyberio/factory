import { expect } from 'chai'
import { deployments, ethers, getNamedAccounts } from 'hardhat'

const memory: any = {}

describe('CyberTokenBase', function () {
  before(async () => {
    memory.signers = await ethers.getSigners()
  })

  beforeEach(async () => {
    memory.namedAccounts = await getNamedAccounts()

    await deployments.fixture()
    memory.deployer = memory.signers[0]
    memory.oncyber = memory.signers[1]
    memory.manager = memory.signers[2]
    memory.other = memory.signers[3]
    memory.other2 = memory.signers[4]
    memory.other3 = memory.signers[5]
    memory.other4 = memory.signers[6]
    const contract = await deployments.diamond.deploy('DiamondCyberTokenBase', {
      from: memory.deployer.address,
      owner: memory.deployer.address,
      facets: ['CyberTokenBase'],
      execute: {
        methodName: 'initialize',
        args: [
          'ipfs://',
          memory.manager.address,
          memory.namedAccounts.biconomyForwarder,
          memory.namedAccounts.opensea,
          memory.oncyber.address,
        ],
      },
    })
    memory.contract = await ethers.getContractAt(contract.abi, contract.address, memory.deployer)
  })

  it('Should sets up the contract', async () => {
    expect(await memory.contract['totalSupply()']()).to.eq('0')
    expect(await memory.contract.manager()).to.be.eq(memory.manager.address)
    expect(await memory.contract.oncyber()).to.be.eq(memory.oncyber.address)
    expect(await memory.contract.isTrustedForwarder(memory.namedAccounts.biconomyForwarder)).to.be.true
    expect(await memory.contract.minterNonce(memory.other.address)).to.eq('0')
  })

  it('Should throw to get uri of not existing token', async () => {
    await expect(memory.contract.connect(memory.other).uri(0)).to.be.revertedWith('ERC1155URI: tokenId not exist')
  })

  it('Should owner initialise', async () => {
    await memory.contract
      .connect(memory.deployer)
      .initialize('new_uri', memory.other.address, memory.other2.address, memory.other3.address, memory.other4.address)
    expect(await memory.contract.manager()).to.be.eq(memory.other.address)
    expect(await memory.contract.isTrustedForwarder(memory.other2.address)).to.be.true

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
