import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { deployments, ethers, getNamedAccounts, network } from 'hardhat'

import { signCreateDropRequest, signMintRequest } from '../lib/utils'

const memory: any = {}

describe('Pod Burning', function () {
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
    const contract = await deployments.diamond.deploy('DiamondCyberDestinationUtility', {
      from: memory.deployer.address,
      owner: memory.deployer.address,
      facets: ['CyberDestinationUtilityFactoryFacet'],
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

  describe('', () => {
    it('should burn + mint w correct amount', async () => {
      const uri = 'Qmsfzefi221ifjzifj'
      const timeStart = parseInt((Date.now() / 1000 - 100).toString())
      const timeEnd = parseInt((Date.now() / 1000 + 10).toString())
      const price = 0
      const amountCap = 40
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

      const tokenId = 1;

      const signatureMint = await signMintRequest(tokenId, 2, memory.other2.address, 0, memory.manager)

      await memory.contract.connect(memory.other2).mint(tokenId, 2, signatureMint, {
        value: 0,
      })

      await expect(
        memory.contract.connect(memory.other).mintTransfer(memory.other.address, tokenId, 1)
      ).to.be.revertedWith('NS')
    })

    it('shouldnt burn & mint if not correct token', async () => {
    })

    it('shouldnt mint if wrong amount', async () => {
    })

    it('shouldnt mint if wrong balance loot', async () => {
    })

    it('shouldnt if wrong balance spacepods', async () => {
    })
  })
})
