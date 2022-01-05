import { BigNumber, Signer, utils } from 'ethers'

export async function signCreateDropRequest(
  uri: string,
  timeStart: number,
  timeEnd: number,
  priceStart: BigNumber,
  priceEnd: BigNumber,
  stepDuration: number,
  amountCap: number,
  shareCyber: number,
  creator: string,
  nonce: number,
  signer: Signer
): Promise<string> {
  const pUri = utils.toUtf8Bytes(uri)
  const pTimeStart = utils.hexZeroPad(
    BigNumber.from(timeStart).toHexString(),
    32
  )
  const pTimeEnd = utils.hexZeroPad(BigNumber.from(timeEnd).toHexString(), 32)
  const pPriceStart = utils.hexZeroPad(
    BigNumber.from(priceStart).toHexString(),
    32
  )
  const pPriceEnd = utils.hexZeroPad(BigNumber.from(priceEnd).toHexString(), 32)
  const pStepDuration = utils.hexZeroPad(
    BigNumber.from(stepDuration).toHexString(),
    32
  )
  const pAmountCap = utils.hexZeroPad(
    BigNumber.from(amountCap).toHexString(),
    32
  )
  const pShareCyber = utils.hexZeroPad(
    BigNumber.from(shareCyber).toHexString(),
    32
  )
  const pCreator = utils.arrayify(creator)
  const pNonce = utils.hexZeroPad(BigNumber.from(nonce).toHexString(), 32)
  const message = utils.concat([
    pUri,
    pTimeStart,
    pTimeEnd,
    pPriceStart,
    pPriceEnd,
    pStepDuration,
    pAmountCap,
    pShareCyber,
    pCreator,
    pNonce,
  ])

  const hash = utils.keccak256(message)
  const pHash = utils.arrayify(hash)

  return signer.signMessage(pHash)
}

export async function signMintRequest(
  tokenId: number,
  creator: string,
  nonce: number,
  signer: Signer
): Promise<string> {
  const pTokenId = utils.hexZeroPad(BigNumber.from(tokenId).toHexString(), 32)
  const pNonce = utils.hexZeroPad(BigNumber.from(nonce).toHexString(), 32)
  const pCreator = utils.arrayify(creator)
  const message = utils.concat([pTokenId, pCreator, pNonce])

  const hash = utils.keccak256(message)
  const pHash = utils.arrayify(hash)

  return signer.signMessage(pHash)
}
