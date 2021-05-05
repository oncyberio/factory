import { VercelRequest, VercelResponse } from '@vercel/node'
import { Wallet } from '@ethersproject/wallet'
import { getAddress } from 'ethers/lib/utils'
import formidable from 'formidable-serverless'

import { config } from '../config'
import { Log } from '../libs/logger'
import Pinata from '../libs/pinata'
import { signURI } from '../libs/sign'

const logger = Log({ service: 'generation' })
const signer = new Wallet(config.privateKey)

export default async (req: VercelRequest, res: VercelResponse) => {

  if(req.method === 'OPTIONS') {

    return res.status(200).end()

  }

  const form = new formidable.IncomingForm()

  const { error, fields, files } = await new Promise( (resolve) =>
    form.parse(req, (error, fields, files) => resolve({ error, fields, files }) ) )

  if(error){

    logger.error('Error on form parse', { error })
    return res.status(400).json({
      status: 'error',
      message: 'invalid request format',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null
    })

  }

  const amount = !isNaN(fields.amount) && !isNaN(parseInt(fields.amount) ) && parseInt(fields.amount)
  const address = getAddress(fields.address)
  const file = files.file

  if(!amount || !address || !file){

    logger.error('Error on form data', { error, fields })
    return res.status(400).json({
      status: 'error',
      message: 'invalid request data',
      ipfsHashMetadata: null,
      ipfsHashImage: null,
      signature: null
    })

  }

  logger.info('start processing', { address })

  const ipfsHashImage = await Pinata.uploadImage(file, address)
  const ipfsHashMetadata = await Pinata.uploadMetadata(ipfsHashImage, address, amount)
  const signature = await signURI(ipfsHashMetadata, amount, address, signer)

  logger.info('end processing', { address, ipfsHashMetadata, ipfsHashImage })

  res.status(200).json({
    status: 'success',
    ipfsHashMetadata,
    ipfsHashImage,
    signature
  })

}
