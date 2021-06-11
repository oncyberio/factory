import {
  arrayify,
  concat,
  keccak256,
  toUtf8Bytes,
  hexZeroPad,
} from 'ethers/lib/utils'
import { BigNumber } from 'ethers'

export async function signURI(
  uri,
  amount,
  amountOncyber,
  nonce,
  minter,
  signer
){
  const aURI = toUtf8Bytes(uri)
  const aMinter = arrayify(minter)
  const aAmount = hexZeroPad(BigNumber.from(amount).toHexString(), 32)
  const aAmountOncyber = hexZeroPad(BigNumber.from(amountOncyber).toHexString(), 32)
  const aNonce = hexZeroPad(BigNumber.from(nonce).toHexString(), 32)
  const message = concat([aURI, aAmount, aAmountOncyber, aNonce, aMinter])

  const hash = keccak256(message)
  const aHash = arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature
}

export default { signURI }
