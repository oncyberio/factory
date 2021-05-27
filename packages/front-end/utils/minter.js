// @ts-ignore
import * as Web3 from 'web3'
import { ethers } from 'ethers';
import jsonContract from '../config/DiamondCyberDestinationFactory.json';


async function getNonce() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const minter = provider.getSigner();

    const contract = new ethers.Contract(
        jsonContract.address,
        jsonContract.abi,
        minter
    )

    const address = await minter.getAddress()

    return (await contract.minterNonce(address)).toString();
}

async function mint(uri, amount, signature) {

  console.log("GOT TO MINTING")

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const minter = provider.getSigner();

  const contract = new ethers.Contract(
    jsonContract.address,
    jsonContract.abi,
    minter
  )

  const tx = await contract.mint(uri, amount, signature)

  await tx.wait()

  return 1;
}

export { mint, getNonce };
