// @ts-ignore
import Web3 from 'web3';
import { ethers } from 'ethers';
import { Biconomy } from '@biconomy/mexa';
import mainnetContract from '../config/mainnet/DiamondCyberDestinationFactory.json';
import mainnetUtilityContract from '../config/mainnet/DiamondCyberDestinationUtilityFactory.json';

import mumbaiContract from '../config/mumbai/DiamondCyberDestinationFactory.json';
import mumbaiUtilityContract from '../config/mumbai/DiamondCyberDestinationUtilityFactory.json';

import config from '../config';

async function getNonce(collection) {
    const providerSigner = new ethers.providers.Web3Provider(window.ethereum);

    const minter = providerSigner.getSigner();
    const address = await minter.getAddress();

    let provider;
    let jsonContract;

    if (config.env == 'development') {
      console.log("get dev")
      jsonContract = (collection == 'destination' ? mumbaiContract : mumbaiUtilityContract);
      provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today');
    }
    else {
      console.log('not dev')
      jsonContract = (collection == 'destination' ? mainnetContract : mainnetUtilityContract);
      provider = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.matic.network');
    }

    const contract = new ethers.Contract(
        jsonContract.address,
        jsonContract.abi,
        provider
    )

    return (await contract.minterNonce(address)).toString();
}

async function mint(uri, amount, amountOncyber, signature, collection) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const minter = provider.getSigner();

  let jsonContract;

  if (config.env == 'development') {
    console.log("NODE ENV TEST")
    jsonContract = (collection == 'destination' ? mumbaiContract : mumbaiUtilityContract);
  }
  else {
    console.log("NODE ENV PROD")
    jsonContract = (collection == 'destination' ? mainnetContract : mainnetUtilityContract);

    // jsonContract = mainnetContract;
  }

  const contract = new ethers.Contract(
    jsonContract.address,
    jsonContract.abi,
    minter
  )

  const tx = await contract.mint(uri, amount, amountOncyber, signature)

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

async function mintForwarder(uri, amount, amountOncyber, signature, collection) {

  let provider;
  let jsonContract;
  if (config.env == 'development') {
    console.log("get dev")
    jsonContract = (collection == 'destination' ? mumbaiContract : mumbaiUtilityContract);
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.matic.today');
  }
  else {
    console.log('not dev')
    jsonContract = (collection == 'destination' ? mainnetContract : mainnetUtilityContract);
    provider = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.matic.network');
  }

  const biconomy = new Biconomy(provider, {
    walletProvider: window.ethereum,
    apiKey: config.biconomyApiKey,
    strictMode: true,
    debug: true
  })
  
  await new Promise( (resolve, reject) =>
    biconomy.onEvent(biconomy.READY, () => resolve(true) ).onEvent(biconomy.ERROR, (error) => reject(error) ) );

  const ethersProvider = new ethers.providers.Web3Provider(Web3.givenProvider);

  const minter = ethersProvider.getSigner();
  const minterAddress = await minter.getAddress();

  const contract = new ethers.Contract(
    jsonContract.address,
    jsonContract.abi,
    biconomy.getSignerByAddress(minterAddress)
  )
  const { data } = await contract.populateTransaction.mint(uri, amount, amountOncyber, signature);
  const providerBiconomy = biconomy.getEthersProvider();
  const gasLimit = await providerBiconomy.estimateGas({
    to: jsonContract.address,
    from: minterAddress,
    data: data
  });
  const txParams = {
    to: jsonContract.address,
    data,
    from: minterAddress,
    gasLimit,
    signatureType: "EIP712_SIGN"
  }
  const txHash = await providerBiconomy.send("eth_sendTransaction", [txParams]);

  console.log('txHash', txHash)
  provider.once(txHash, (transaction) => {
    // Emitted when the transaction has been mined
    //show success message
    console.log('transaction', transaction);
    //do something with transaction hash
  });

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
