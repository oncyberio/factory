import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { diamond } = deployments

  const namedAccounts = await getNamedAccounts()
  await diamond.deploy('DiamondCyberObjectFactory', {
    from: namedAccounts.deployer,
    owner: namedAccounts.deployer,
    facets: ['CyberObjectFactoryFacet'],
    execute: {
      methodName: 'initialize',
      args: [
        'ipfs://',
        namedAccounts.managerObject,
        namedAccounts.biconomyForwarder,
        namedAccounts.opensea,
        namedAccounts.oncyber,
      ],
    },
    log: true,
  })
}
export default func
func.tags = ['DiamondCyberObjectFactory']
