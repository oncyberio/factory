import {
  arrayify,
  concat,
  keccak256,
  toUtf8Bytes,
  hexZeroPad,
} from 'ethers/lib/utils'
import { Wallet } from '@ethersproject/wallet'
import { BigNumber } from 'ethers'

export async function signURI(
  uri: string,
  amount: number,
  nonce: number,
  minter: string,
  signer: Wallet
): Promise<string> {
  const aURI = toUtf8Bytes(uri)
  const aMinter = arrayify(minter)
  const aAmount = hexZeroPad(BigNumber.from(amount).toHexString(), 32)
  const aNonce = hexZeroPad(BigNumber.from(nonce).toHexString(), 32)
  const message = concat([aURI, aAmount, aNonce, aMinter])

  const hash = keccak256(message)
  const aHash = arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature
}

export default { signURI }
