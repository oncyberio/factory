import { ethers, network } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

import type {
  DummyContract,
  DummyNFT,
  CyberMarketplace} from '../typechain-types'

const contracts: {
  marketplace: CyberMarketplace
  nft: DummyNFT
  notAllowedNft: DummyNFT,
  dummy: DummyContract
} = {} as any

const signers: Record<string, SignerWithAddress> = {}

const KONG = 1
const PUDGY = 2

function days(n: number) {
  return n * 24 * 60 * 60
}

function eth(n: number) {
  return ethers.utils.parseEther(String(n))
}



describe('CyberMarketplace', function () {
  beforeEach(async () => {
    const signerArr = await ethers.getSigners()
    signers.deployer = signerArr[0]
    signers.seller = signerArr[1]
    signers.nonSeller = signerArr[2]
    signers.buyer = signerArr[3]
    signers.addr1 = signerArr[4]

    const MarketplaceContract = await ethers.getContractFactory(
      'CyberMarketplace'
    )

    const NFTContract = await ethers.getContractFactory('DummyNFT')

    const DummyContract = await ethers.getContractFactory('DummyContract')

    contracts.marketplace = (await MarketplaceContract.deploy()) as any
    contracts.nft = (await NFTContract.deploy()) as any
    contracts.notAllowedNft = (await NFTContract.deploy()) as any
    contracts.dummy = (await DummyContract.deploy()) as any

    await contracts.nft.safeTransferFrom(
      signers.deployer.address,
      signers.seller.address,
      KONG,
      10,
      '0x00'
    )

    await contracts.nft.safeTransferFrom(
      signers.deployer.address,
      signers.nonSeller.address,
      PUDGY,
      10,
      '0x00'
    )
    

    await contracts.nft
      .connect(signers.seller)
      .setApprovalForAll(contracts.marketplace.address, true)

  })

  describe('init', () => {
    it('init should revert on invalid NFT', async () => {
      await expect(
        contracts.marketplace.init([
          contracts.notAllowedNft.address,
          contracts.dummy.address
        ])
      ).to.be.revertedWith('Invalid NFT')

      await expect(
        contracts.marketplace.whitelist(contracts.dummy.address)
      ).to.be.revertedWith('Invalid NFT')

      await expect(
        contracts.marketplace.whitelist(contracts.nft.address)
      ).to.be.not.revertedWith('Invalid NFT')

    })
  })

  describe('sell', () => {

    beforeEach(async () => {
      await contracts.marketplace.whitelist(contracts.nft.address)
    })

    it('Should revert on non whitelisted NFT', async () => {
      await expect(
        contracts.marketplace.sell(
          contracts.notAllowedNft.address,
          KONG,
          eth(1),
          days(1)
        )
      ).to.be.revertedWith('Not whitelisted')
    })

    it('Should revert on empty balance', async () => {
      await expect(
        contracts.marketplace
          .connect(signers.addr1)
          .sell(contracts.nft.address, KONG, eth(1), days(1))
      ).to.be.revertedWith('Empty balance')
    })

    it('Should revert if non approved', async () => {
      await expect(
        contracts.marketplace
          .connect(signers.nonSeller)
          .sell(contracts.nft.address, PUDGY, eth(1), days(1))
      ).to.be.revertedWith('Not approved')
    })

    it('Should sell', async () => {
      const price = eth(1)
      const duration = days(1)

      const tx = await contracts.marketplace
        .connect(signers.seller)
        .sell(contracts.nft.address, KONG, price, duration)

      const result = await tx.wait()
      expect(result.events?.length).to.be.greaterThan(0)

      const sellEvent = result.events?.find((it: any) => it.event === 'Sell')
      expect(sellEvent).to.be.not.undefined

      expect(
        await contracts.nft.balanceOf(contracts.marketplace.address, KONG)
      ).to.be.equal(1)
      // expect(event.args[1]).to.be.equal(contracts.nft.address)
      // expect(event.args[2]).to.be.equal(signers.deployer.address)
      // expect(event.args[3]).to.be.equal(KONG)
      // expect(event.args[4]).to.be.equal(price)
      // expect(event.args[6]).to.be.equal(duration)
    })
  })

  describe('buy', () => {

    beforeEach(async () => {
      await contracts.marketplace.whitelist(contracts.nft.address)
    })

    it('Should buy', async () => {
      const price = eth(1)

      const tx = await contracts.marketplace
        .connect(signers.seller)
        .sell(contracts.nft.address, KONG, price, days(1))
        .then((tx: any) => tx.wait())

      const listingId = tx.events.find((it: any) => it.event === 'Sell').args[0]

      const sellerBalanceBefore = await signers.seller.getBalance()

      const tx2 = await contracts.marketplace
        .connect(signers.buyer)
        .buy(listingId, { value: price })
        .then((tx: any) => tx.wait())

      const sellEvent = tx2.events?.find((it: any) => it.event === 'Buy')
      expect(sellEvent).to.be.not.undefined

      const sellerBalanceAfter = await signers.seller.getBalance()

      expect(sellerBalanceAfter.sub(sellerBalanceBefore)).to.be.equal(
        price,
        "Should add price to seller's balance"
      )

      expect(
        await contracts.nft.balanceOf(signers.buyer.address, KONG)
      ).to.be.equal(1)

      await expect(
        contracts.marketplace.buy(listingId, { value: price })
      ).to.be.revertedWith('Invalid listing id')
    })

    it('Should fail to buy if price is insufficient', async () => {
      const price = eth(2)

      const tx = await contracts.marketplace
        .connect(signers.seller)
        .sell(contracts.nft.address, KONG, price, days(1))
        .then((tx: any) => tx.wait())

      const listingId = tx.events.find((it: any) => it.event === 'Sell').args[0]

      await expect(
        contracts.marketplace.buy(listingId, { value: eth(1) })
      ).to.be.revertedWith('Invalid price')
    })

    it('Should fail to buy if expired', async () => {
      const price = eth(1)
      const duration = days(1)

      const tx = await contracts.marketplace
        .connect(signers.seller)
        .sell(contracts.nft.address, KONG, price, duration)
        .then((tx: any) => tx.wait())

      const event = tx.events.find((it: any) => it.event === 'Sell')
      const listingId = event.args[0]

      await network.provider.send('evm_increaseTime', [days(1) + 1])
      await network.provider.send('evm_mine')

      await expect(
        contracts.marketplace.buy(listingId, { value: price })
      ).to.be.revertedWith('Listing expired')
    })
  })
})
