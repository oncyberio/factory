import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { diamond } = deployments

  const namedAccounts = await getNamedAccounts()
  await diamond.deploy('DiamondOnCyberAndFriendsFactory', {
    from: namedAccounts.deployer,
    owner: namedAccounts.deployer,
    facets: ['OnCyberAndFriendsFactoryFacet'],
    execute: {
      methodName: 'initialize',
      args: [
        'ipfs://',
        namedAccounts.managerAndFriends,
        namedAccounts.biconomyForwarder,
        namedAccounts.opensea,
        namedAccounts.oncyber,
      ],
    },
    log: true,
  })
}
export default func
func.tags = ['DiamondOnCyberAndFriendsFactory']
