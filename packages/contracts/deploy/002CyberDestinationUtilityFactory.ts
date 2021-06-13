import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import {ethers} from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  // const { diamond } = deployments

  const namedAccounts = await getNamedAccounts()
  const Contract = await deployments.get('DiamondCyberDestinationUtilityFactory')
  const accounts = await ethers.getSigners()
  const minter = accounts[0]
  const contract = await ethers.getContractAt(
    Contract.abi,
    Contract.address,
    minter
  )
  await contract.initialize(
    'ipfs://',
    namedAccounts.managerDestinationUtility,
    namedAccounts.biconomyForwarder,
    namedAccounts.opensea,
    namedAccounts.oncyber
  )
  // await diamond.deploy('DiamondCyberDestinationUtilityFactory', {
  //   from: namedAccounts.deployer,
  //   owner: namedAccounts.deployer,
  //   facets: ['CyberDestinationUtilityFactoryFacet'],
  //   execute: {
  //     methodName: 'initialize',
  //     args: [
  //       'ipfs://',
  //       namedAccounts.managerDestinationUtility,
  //       namedAccounts.biconomyForwarder,
  //       namedAccounts.opensea,
  //       namedAccounts.oncyber
  //     ],
  //   },
  //   log: true,
  // })
}
export default func
func.tags = ['DiamondCyberDestinationUtilityFactory']
