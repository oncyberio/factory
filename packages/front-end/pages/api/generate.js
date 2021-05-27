import { Wallet } from '@ethersproject/wallet'
import { getAddress } from 'ethers/lib/utils'
import CID from 'cids'
import { Log } from '../../libs/logger'
import Pinata from '../../libs/pinata'
import { signURI } from '../../libs/sign'
import { auth } from '../../utils/authMiddleware'
import config from '../../config';

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

  return cidParsed.toString()

}

export default async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (req.body && typeof req.body === "string") {
    req.body = JSON.parse(req.body);
  }

  // decode token here, acts like a middleware
  var userId = await auth(req);

  const { payload } = req.body;

  // default of 20 editions minted
  const amount =
    (!isNaN(payload.amount) &&
    !isNaN(parseInt(payload.amount)) &&
    parseInt(payload.amount));

  const nonce =
    !isNaN(payload.nonce) &&
    !isNaN(parseInt(payload.nonce)) &&
    parseInt(payload.nonce);

  const address = getAddressCatch(userId)
  const thumbHash = getCIDCatch(payload.thumbHash)
  const destHash = getCIDCatch(payload.destHash)

  if (!amount || !address || !thumbHash || !destHash) {
    logger.error('Error on form data', { payload })
    return res.status(400).json({
      status: 'error',
      message: 'invalid request data',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null,
    })
  }

  if(!config.allowedMinter.includes(address) ){

    logger.error('Error on form data address not allowed', { payload })
    return res.status(400).json({
      status: 'error',
      message: 'invalid request data address not allowed',
      ipfsHashMetadata: null,
      signature: null,
    })
  }

  if(nonce < 0 || nonce > config.minterNonceMax){
    logger.error('Error max form data nonce', { payload })
    return res.status(400).json({
      status: 'error',
      message: 'invalid request data nonce max reach',
      ipfsHashMetadata: null,
      signature: null,
    })
  }

  logger.info('start processing', { address })

  await Promise.all([
    Pinata.pinHash(thumbHash, address),
    Pinata.pinHash(destHash, address)
  ])

  const ipfsHashMetadata = await Pinata.uploadMetadata(
    thumbHash,
    destHash,
    address,
    amount
  )

  const signature = await signURI(ipfsHashMetadata, amount, nonce, address, signer)

  logger.info('end processing', { payload, ipfsHashMetadata, })

  res.status(200).json({
    status: 'success',
    ipfsHashMetadata,
    signature,
  })
}
