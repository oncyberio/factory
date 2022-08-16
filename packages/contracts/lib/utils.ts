import { BigNumber, Signer, utils } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

export const tokenURI = (uri: string) => `ipfs://${uri}`

export async function signCreateDropRequest(
  uri: string,
  timeStart: number,
  timeEnd: number,
  price: BigNumber,
  amountCap: number,
  shareCyber: number,
  creator: string,
  nonce: number,
  signer: Signer
): Promise<string> {
  const pUri = utils.toUtf8Bytes(uri)
  const pTimeStart = utils.hexZeroPad(BigNumber.from(timeStart).toHexString(), 32)
  const pTimeEnd = utils.hexZeroPad(BigNumber.from(timeEnd).toHexString(), 32)
  const pPrice = utils.hexZeroPad(BigNumber.from(price).toHexString(), 32)
  const pAmountCap = utils.hexZeroPad(BigNumber.from(amountCap).toHexString(), 32)
  const pShareCyber = utils.hexZeroPad(BigNumber.from(shareCyber).toHexString(), 32)
  const pCreator = utils.arrayify(creator)
  const pNonce = utils.hexZeroPad(BigNumber.from(nonce).toHexString(), 32)
  const message = utils.concat([pUri, pTimeStart, pTimeEnd, pPrice, pAmountCap, pShareCyber, pCreator, pNonce])

  const hash = utils.keccak256(message)
  const pHash = utils.arrayify(hash)

  return signer.signMessage(pHash)
}

export async function signMintRequest(
  tokenId: number,
  quantity: number,
  creator: string,
  nonce: number,
  signer: Signer
): Promise<string> {
  const pTokenId = utils.hexZeroPad(BigNumber.from(tokenId).toHexString(), 32)
  const pQuantity = utils.hexZeroPad(BigNumber.from(quantity).toHexString(), 32)
  const pNonce = utils.hexZeroPad(BigNumber.from(nonce).toHexString(), 32)
  const pCreator = utils.arrayify(creator)
  const message = utils.concat([pTokenId, pQuantity, pCreator, pNonce])

  const hash = utils.keccak256(message)
  const pHash = utils.arrayify(hash)

  return signer.signMessage(pHash)
}

export const displayAmount = (amount: BigNumber, decimal = 2): string =>
  parseFloat(formatEther(amount)).toFixed(decimal)
