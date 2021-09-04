import * as Web3 from 'web3'
import { OpenSeaPort, Network } from 'opensea-js'
import { WyvernSchemaName, OrderSide } from 'opensea-js/lib/types'

export const listAsset = async (context, asset, startAmount = 0.001) => {
  // if (!this.account) await this.connect();
  // Reward referrers with 10% of the final sale price,
  // or 10 ETH in this case
  // const provider = await detectEthereumProvider();
  const seaport = new OpenSeaPort(
    context.ethereum,
    {
      networkName: Network.Main,
    },
    (arg) => console.log(arg)
  )

  try {
    const auction = await seaport.createSellOrder({
      asset: {
        tokenId: asset.token_id,
        tokenAddress: asset.token_address,
        schemaName: WyvernSchemaName.ERC1155,
      },
      accountAddress: context.user.id,
      startAmount,
      // expirationTime,
      // paymentTokenAddress,
      // waitForHighestBid: true
    })

    return auction
  } catch (e) {
    console.log(e)
    return false
  }
}
