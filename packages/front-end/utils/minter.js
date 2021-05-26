// @ts-ignore
import * as Web3 from 'web3'
import hre, { ethers } from 'hardhat'

async function mint(uri, amount, signature) {
  const { deployments } = hre

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const minter = provider.getSigner();

  const Contract = await deployments.get('DiamondCyber');

  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )

  const tx = await contract.mint(uri, amount, signature)

  await tx.wait()

  const balanceMinter = await contract.balanceOf(minter.address, 0)
  
  return balanceMinter;
}

export { mint };