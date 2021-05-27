// @ts-ignore
import * as Web3 from 'web3'
import ethers from 'ethers';
import {abi, address} from './contract';

async function mint(uri, amount, signature) {

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const minter = provider.getSigner();

  const contract = new ethers.Contract(
    abi,
    address,
    minter
  )

  const tx = await contract.mint(uri, amount, signature)

  await tx.wait()

  const balanceMinter = await contract.balanceOf(minter.address, 0)
  
  return balanceMinter;
}

export { mint };