import { Wallet } from '@ethersproject/wallet'
import { getAddress } from 'ethers/lib/utils'
import CID from 'cids'

import { config } from '../../utils/config'
import { Log } from '../../libs/logger'
import Pinata from '../../libs/pinata'
import { signURI } from '../../libs/sign'

const logger = Log({ service: 'generation' })
const signer = new Wallet(config.privateKey)

function getAddressCatch(address) {

  let addressParsed = false

  try {

    addressParsed = getAddress(address)

  } catch (error) {

    logger.error('address invalid', { error, address })

  }

  return addressParsed

}

function getCIDCatch(cid) {

  let cidParsed = false

  try {

    cidParsed = new CID(cid)

  } catch (error) {

    logger.error('cid invalid', { error, cid })

  }

  return cidParsed

}

export default async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const fields = req.body

  const amount =
    !isNaN(fields.amount) &&
    !isNaN(parseInt(fields.amount)) &&
    parseInt(fields.amount)
  const nonce =
    !isNaN(fields.nonce) &&
    !isNaN(parseInt(fields.nonce)) &&
    parseInt(fields.nonce)
  const address = getAddressCatch(fields.address)
  const hash = getCIDCatch(fields.hash)

  if (!amount || !address || !hash) {
    logger.error('Error on form data', { fields })
    return res.status(400).json({
      status: 'error',
      message: 'invalid request data',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null,
    })
  }

  if(!config.allowedMinter.includes(address) ){

    logger.error('Error on form data address not allowed', { fields })
    return res.status(400).json({
      status: 'error',
      message: 'invalid request data address not allowed',
      ipfsHashMetadata: null,
      signature: null,
    })

  }

  if(nonce < 0 || nonce > config.minterNonceMax){
    logger.error('Error max form data nonce', { fields })
    return res.status(400).json({
      status: 'error',
      message: 'invalid request data nonce max reach',
      ipfsHashMetadata: null,
      signature: null,
    })
  }
  logger.info('start processing', { address })

  await Pinata.pinHash(fields.hash, address)
  const ipfsHashMetadata = await Pinata.uploadMetadata(
    fields.hash,
    address,
    amount
  )
  const signature = await signURI(ipfsHashMetadata, amount, nonce, address, signer)

  logger.info('end processing', { fields, ipfsHashMetadata, })

  res.status(200).json({
    status: 'success',
    ipfsHashMetadata,
    signature,
  })
}
