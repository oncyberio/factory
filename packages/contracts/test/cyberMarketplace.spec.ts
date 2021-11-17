import chai from 'chai'
import { solidity } from 'ethereum-waffle'
import { ethers, network } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { BigNumber, Contract } from 'ethers'

import type {
  DummyContract,
  DummyNFT,
  CyberMarketplace,
} from '../typechain-types'

const contracts: {
  marketplace: CyberMarketplace
  nft: DummyNFT
  dummy: DummyContract
} = {} as any

const signers: Record<string, SignerWithAddress> = {}

const KONG = 1
const PUDGY = 2

function days(n: number) {
  return n * 24 * 60 * 60
}

function eth(n: number) {
  return BigNumber.from(n).mul(BigNumber.from(10).pow(18))
}

function big(n: number) {
  return BigNumber.from(n)
}

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('CyberMarketplace', function () {
  beforeEach(async () => {
    let signerArr = await ethers.getSigners()
    signers.deployer = signerArr[0]
    signers.seller = signerArr[1]
    signers.buyer = signerArr[2]
    signers.addr1 = signerArr[3]

    const MarketplaceContract = await ethers.getContractFactory(
      'CyberMarketplace'
    )

    const NFTContract = await ethers.getContractFactory('DummyNFT')

    const DummyContract = await ethers.getContractFactory('DummyContract')

    contracts.marketplace = (await MarketplaceContract.deploy()) as any
    contracts.nft = (await NFTContract.deploy()) as any
    contracts.dummy = (await DummyContract.deploy()) as any

    await contracts.nft.safeTransferFrom(
      signers.deployer.address,
      signers.seller.address,
      KONG,
      10,
      '0x00'
    )

    await contracts.nft
      .connect(signers.seller)
      .setApprovalForAll(contracts.marketplace.address, true)
  })

  describe('sell', () => {
    it('Should revert on invalid NFT', async () => {
      await expect(
        contracts.marketplace.sell(
          contracts.dummy.address,
          KONG,
          eth(1),
          days(1)
        )
      ).to.be.revertedWith('Invalid NFT')
    })

    it('Should revert on empty balance', async () => {
      await expect(
        contracts.marketplace
          .connect(signers.buyer)
          .sell(contracts.nft.address, KONG, eth(1), days(1))
      ).to.be.revertedWith('Empty balance')
    })

    it('Should sell', async () => {
      const price = eth(1)
      const duration = days(1)

      const tx = await contracts.marketplace
        .connect(signers.seller)
        .sell(contracts.nft.address, KONG, price, duration)

      let result = await tx.wait()
      expect(result.events?.length).to.be.greaterThan(0)

      let sellEvent = result.events?.find((it: any) => it.event === 'Sell')
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
    it('Should buy', async () => {
      const price = eth(1)

      let tx = await contracts.marketplace
        .connect(signers.seller)
        .sell(contracts.nft.address, KONG, price, days(1))
        .then((tx: any) => tx.wait())

      let listingId = tx.events.find((it: any) => it.event === 'Sell').args[0]

      let sellerBalanceBefore = await signers.seller.getBalance()

      tx = await contracts.marketplace
        .connect(signers.buyer)
        .buy(listingId, { value: price })
        .then((tx: any) => tx.wait())

      let sellEvent = tx.events?.find((it: any) => it.event === 'Buy')
      expect(sellEvent).to.be.not.undefined

      let sellerBalanceAfter = await signers.seller.getBalance()

      expect(sellerBalanceAfter.sub(sellerBalanceBefore)).to.be.equal(
        price,
        "Should add price to seller's balance"
      )

      expect(
        await contracts.nft.balanceOf(signers.buyer.address, KONG)
      ).to.be.equal(1)
    })

    it('Should fail to buy if price is insufficient', async () => {
      let price = eth(2)

      let tx = await contracts.marketplace
        .connect(signers.seller)
        .sell(contracts.nft.address, KONG, price, days(1))
        .then((tx: any) => tx.wait())

      let listingId = tx.events.find((it: any) => it.event === 'Sell').args[0]

      await expect(
        contracts.marketplace.buy(listingId, { value: eth(1) })
      ).to.be.revertedWith('Invalid price')
    })

    it('Should fail to buy if expired', async () => {
      let price = eth(1)
      let duration = days(1)

      let tx = await contracts.marketplace
        .connect(signers.seller)
        .sell(contracts.nft.address, KONG, price, duration)
        .then((tx: any) => tx.wait())

      let event = tx.events.find((it: any) => it.event === 'Sell')
      let listingId = event.args[0]

      await network.provider.send('evm_increaseTime', [days(1) + 1])
      await network.provider.send('evm_mine')

      await expect(
        contracts.marketplace.buy(listingId, { value: price })
      ).to.be.revertedWith('Listing expired')
    })
  })
})
