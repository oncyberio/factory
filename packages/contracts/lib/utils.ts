import {BigNumber, Signer, utils} from 'ethers'

export async function signMintingRequest(
  uri: string,
  amount: string,
  minter: string,
  signer: Signer
) : Promise<string> {
  const aURI = utils.toUtf8Bytes(uri)
  const aAmount = utils.hexZeroPad(BigNumber.from(amount).toHexString(), 32)
  const aMinter = utils.arrayify(minter)
  const message = utils.concat([aURI, aAmount, aMinter])

  const hash = utils.keccak256(message)
  const aHash = utils.arrayify(hash)

  const signature = await signer.signMessage(aHash)
  return signature
}
