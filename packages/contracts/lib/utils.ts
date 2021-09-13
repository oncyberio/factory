import { BigNumber, Signer, utils } from 'ethers'

export async function signMintingRequest(
  uri: string,
  amount: string,
  amountOncyber: string,
  nonce: string,
  minter: string,
  signer: Signer
): Promise<string> {
  const aURI = utils.toUtf8Bytes(uri)
  const aAmount = utils.hexZeroPad(BigNumber.from(amount).toHexString(), 32)
  const aAmountOncyber = utils.hexZeroPad(
    BigNumber.from(amountOncyber).toHexString(),
    32
  )
  const aNonce = utils.hexZeroPad(BigNumber.from(nonce).toHexString(), 32)
  const aMinter = utils.arrayify(minter)
  const message = utils.concat([aURI, aAmount, aAmountOncyber, aNonce, aMinter])

  const hash = utils.keccak256(message)
  const aHash = utils.arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature
}

export async function signMintingUtilityRequest(
  uri: string,
  timeStart: number,
  timeEnd: number,
  price: number,
  amountCap: number,
  shareCyber: number,
  nonce: string,
  minter: string,
  signer: Signer
): Promise<string> {
  const aURI = utils.toUtf8Bytes(uri)
  const aTimeStart = utils.hexZeroPad(
    BigNumber.from(timeStart).toHexString(),
    32
  )
  const aTimeEnd = utils.hexZeroPad(BigNumber.from(timeEnd).toHexString(), 32)
  const aPrice = utils.hexZeroPad(BigNumber.from(price).toHexString(), 32)
  const aAmountCap = utils.hexZeroPad(
    BigNumber.from(amountCap).toHexString(),
    32
  )
  const ashareCyber = utils.hexZeroPad(
    BigNumber.from(shareCyber).toHexString(),
    32
  )
  const aNonce = utils.hexZeroPad(BigNumber.from(nonce).toHexString(), 32)
  const aMinter = utils.arrayify(minter)
  const message = utils.concat([
    aURI,
    aTimeStart,
    aTimeEnd,
    aPrice,
    aAmountCap,
    ashareCyber,
    aNonce,
    aMinter,
  ])

  const hash = utils.keccak256(message)
  const aHash = utils.arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature
}
