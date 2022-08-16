import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre

  const namedAccounts = await getNamedAccounts()
  await deployments.deploy('OnCyberMultiSender', {
    from: namedAccounts.deployer,
    log: true,
  })
}
export default func
func.tags = ['OnCyberMultiSender']
