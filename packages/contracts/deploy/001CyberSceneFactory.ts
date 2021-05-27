import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { diamond } = deployments

  const namedAccounts = await getNamedAccounts()
  await diamond.deploy('DiamondCyberSceneFactory', {
    from: namedAccounts.deployer,
    owner: namedAccounts.deployer,
    facets: ['CyberSceneFactoryFacet'],
    execute: {
      methodName: 'initialize',
      args: ['ipfs://', namedAccounts.manager, namedAccounts.biconomyForwarder, namedAccounts.opensea],
    },
    log: true,
  })
}
export default func
func.tags = ['DiamondCyberSceneFactory']
