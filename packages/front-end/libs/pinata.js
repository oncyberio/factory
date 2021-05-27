import { ReadStream, createReadStream } from 'fs'
import assert from 'assert'
import pinataSDK from '@pinata/sdk'

import { Log } from './logger'
import config from '../config'

const logger = Log({ service: 'pinata' })

const pinata = pinataSDK(config.pinata.apiKey, config.pinata.apiSecret)

export async function uploadImage(
  writeStream,
  address
) {
  const file = createReadStream(writeStream.path)

  const options = {
    pinataMetadata: {
      name: `file_${address}_${Date.now()}`,
      keyvalues: {},
    },
    pinataOptions: {
      cidVersion: 0,
    },
  }

  return pinata
    .pinFileToIPFS(file, options)
    .then((result) => {
      assert(result && result.IpfsHash, 'Pinata uploadFile invalid response')
      return result.IpfsHash
    })
    .catch((error) => {
      logger.error('Pinata uploadFile error', error)

      throw error
    })
}

export async function pinHash(hash, address){

  const options = {
    pinataMetadata: {
      name: `file_${address}_${Date.now()}`,
      keyvalues: {},
    },
    pinataOptions: {
      cidVersion: 0,
    },
  }

  return pinata
    .pinByHash(hash, options)
    .then((result) => {
      assert(['prechecking'].includes(result.status), 'Pinata pin by hash invalid response')
      return result.IpfsHash
    })
    .catch((error) => {
      logger.error('Pinata pin by hash error', error)

      throw error
    })

}

export async function uploadMetadata(
  ipfsHashImage,
  ipfsHashFile,
  address,
  amount,
  name, 
  description
) {
  const options = {
    pinataMetadata: {
      name: `metadata_${address}_${Date.now()}`,
      keyvalues: {
        address,
        amount,
        ipfsHashImage,
        ipfsHashFile,
      },
    },
    pinataOptions: {
      cidVersion: 0,
    },
  }

  return pinata
    .pinJSONToIPFS(
      {
        image: `ipfs://${ipfsHashImage}`,
        destination_url: `ipfs://${ipfsHashFile}`,
        description,
        external_url: `${config.pinata.externalUrlBase}${address}`,
        name,
        // background_color: 'ffffff',
        // attributes: [
        //   {
        //     display_type: 'date',
        //     trait_type: 'birthday',
        //     value: Date.now().toString()
        //   }
        // ]
      },
      options
    )
    .then((result) => {
      // logger.info('result uploadMetadata', { result })
      assert(
        result && result.IpfsHash,
        'Pinata uploadMetadata invalid response'
      )
      return result.IpfsHash
    })
    .catch((error) => {
      logger.error('Pinata uploadMetadata error', error)

      throw error
    })
}

export default { uploadImage, pinHash, uploadMetadata }
