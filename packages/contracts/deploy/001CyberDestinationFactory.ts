import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { diamond } = deployments

  const namedAccounts = await getNamedAccounts()
  const oncyberShare = parseInt(process.env.ONCYBER_SHARE || '30')//in %
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
        namedAccounts.oncyber,
        oncyberShare
      ],
    },
    log: true,
  })
}
export default func
func.tags = ['DiamondCyberDestinationFactory']
