import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { diamond } = deployments
  // DiamondCyberObjectFactory CyberObjectFactoryFacet
  const namedAccounts = await getNamedAccounts()
  await diamond.deploy('DiamondOMFactory', {
    from: namedAccounts.deployer,
    owner: namedAccounts.deployer,
    facets: ['OMFactoryFacet'],
    execute: {
      methodName: 'initialize',
      args: [
        'ipfs://',
        namedAccounts.managerOM,
        namedAccounts.biconomyForwarder,
        namedAccounts.opensea,
        namedAccounts.oncyber,
      ],
    },
    log: true,
  })
}
export default func
func.tags = ['DiamondOMFactory']
