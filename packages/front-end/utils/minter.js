// @ts-ignore
import * as Web3 from 'web3'
import { ethers } from 'ethers';
import mainnetContract from '../config/mainnet/DiamondCyberDestinationFactory.json';
import mumbaiContract from '../config/mumbai/DiamondCyberDestinationFactory.json';
import config from '../config';

async function getNonce() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    const minter = provider.getSigner();

    let jsonContract;

    if (config.env == 'development') {
      console.log("get dev")
      jsonContract = mumbaiContract;
    }
    else {
      console.log('not dev')
      jsonContract = mainnetContract;
    }

    const contract = new ethers.Contract(
        jsonContract.address,
        jsonContract.abi,
        minter
    )

    const address = await minter.getAddress()

    return (await contract.minterNonce(address)).toString();
}

async function mint(uri, amount, signature) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const minter = provider.getSigner();

  let jsonContract;
    
  if (config.env == 'development') {
    console.log("NODE ENV TEST")
    jsonContract = mumbaiContract;
  }
  else {
    console.log("NODE ENV PROD")
    jsonContract = mainnetContract;
  }

  const contract = new ethers.Contract(
    jsonContract.address,
    jsonContract.abi,
    minter
  )

  const amountOnCyber = amount * config.minOncyberShares;

  const tx = await contract.mint(uri, amount, amountOnCyber, signature)

  const txReceipt = await tx.wait()
  // const iface = new ethers.utils.Interface(jsonContract.abi);
  // let tokenId = null

  // txReceipt.logs.forEach( (log) => {
  //   const logParsed = iface.parseLog(log)
  //   if(logParsed.name === 'Minted'){
  //     tokenId = logParsed.args[1].toString()
  //     console.log('tokenId', tokenId)
  //   }
  // })

  return 1;
}

export { mint, getNonce };
