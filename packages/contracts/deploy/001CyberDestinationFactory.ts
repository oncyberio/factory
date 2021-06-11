import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { diamond } = deployments

  const namedAccounts = await getNamedAccounts()
  await diamond.deploy('DiamondCyberDestinationFactory', {
    from: namedAccounts.deployer,
    owner: namedAccounts.deployer,
    facets: ['CyberDestinationFactoryFacet'],
    execute: {
      methodName: 'initialize',
      args: [
        'ipfs://',
        namedAccounts.manager,
        namedAccounts.biconomyForwarder,
        namedAccounts.opensea,
        namedAccounts.oncyber
      ],
    },
    log: true,
  })
}
export default func
func.tags = ['DiamondCyberDestinationFactory']
