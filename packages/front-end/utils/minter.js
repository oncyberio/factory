// @ts-ignore
import * as Web3 from 'web3'
import { ethers } from 'ethers';
import jsonContract from './contract.json';

async function mint(uri, amount, signature) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const minter = provider.getSigner();

  const contract = new ethers.Contract(
    jsonContract,
    "0xFBe0421c53706746151ACa2Cf22F81Dc41262519",
    minter
  )

  const tx = await contract.mint(uri, amount, signature)

  await tx.wait()

  const balanceMinter = await contract.balanceOf(minter.address, 0)
  
  return balanceMinter;
}

export { mint };