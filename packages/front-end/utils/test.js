import { ethers } from 'ethers';
import jsonContract from '../config/DiamondCyberDestinationFactory.json';


async function getBalance(owner) {
    if (!owner.startsWith('0x')) return 0;
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-mainnet.matic.network');

    const contract = new ethers.Contract(
        jsonContract.address,
        jsonContract.abi,
        provider
    )

    balance = await contract.balanceOf(owner, 0);

    console.log(balance)

    return balance;
      // const iface = new ethers.utils.Interface(jsonContract.abi);

    
}

getBalance('0x76DB02500F7631d57BC2DcDCa9d4cf782b99E119');
