const Ipfs = require('ipfs')
const fs = require('fs')

async function Run(){
  const ipfs = await Ipfs.create()
  const path = './scripts/Screenshot.png'
  const file = fs.createReadStream(path)
  const { cid } = await ipfs.add(file)
  console.info('Hash', { cid })

}

Run().catch(error => console.error('Upload to ipfs error', { error } ) )
