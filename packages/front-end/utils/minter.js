// @ts-ignore
import * as Web3 from 'web3'
import { ethers } from 'ethers';
import { Biconomy } from '@biconomy/mexa';
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

async function mintForwarder(uri, amount, amountOncyber, signature) {

  await window.ethereum.enable();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const biconomy = new Biconomy(provider, {
    apiKey: config.biconomyApiKey,
    debug: false
  })

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

  const contractInterface = new ethers.utils.Interface(jsonContract.abi)
  const functionSignature = contractInterface.encodeFunctionData('mint', [uri, amount, amountOncyber, signature])
  const rawTx = {
    to: jsonContract.address,
    data: functionSignature,
    from: await minter.getAddress()
  }

  const signedTx = await minter.signTransaction(rawTx);
  await new Promise( (resolve, reject) =>
    biconomy.onEvent(biconomy.READY, () => resolve(true) ).onEvent(biconomy.ERROR, (error) => reject(error) ) );

  const forwardData = await biconomy.getForwardRequestAndMessageToSign(signedTx);
  console.log(forwardData);

  const signatureBiconomy = await minter.signMessage(forwardData.personalSignatureFormat);

  const data = {
    signature: signatureBiconomy,
    forwardRequest: forwardData.request,
    rawTransaction: signedTx,
    signatureType: biconomy.PERSONAL_SIGN
  }

  const providerBiconomy = biconomy.getEthersProvider()
  const txHash = await providerBiconomy.send('eth_sendRawTransaction', [data])

  console.log('txHash', txHash)
  const receipt = await provider.waitForTransaction(txHash)
  console.log('receipt', receipt)
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

export { mint, mintForwarder, getNonce };
