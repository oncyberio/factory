import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const contractName = 'OnCyberScenes'
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const namedAccounts = await getNamedAccounts();

  await deploy(contractName, {
    from: namedAccounts.deployer,
    args: [namedAccounts.manager],
    log: true
  });


};
export default func;
func.tags = ['OnCyberScenes'];
