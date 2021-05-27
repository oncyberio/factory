// @ts-ignore
import * as Web3 from 'web3'
import { ethers } from 'ethers';
import jsonContract from '../../contracts/deployments/mumbai/DiamondCyber.json';


async function getNonce() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const minter = provider.getSigner();

    const contract = new ethers.Contract(
        jsonContract.address,
        jsonContract.abi,
        minter
    )

    return (await contract.minterNonce(minter.address)).toString();
}

async function mint(uri, amount, signature) {
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
