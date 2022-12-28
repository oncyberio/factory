/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type { Provider } from "@ethersproject/providers";
import { Contract, Signer, utils } from "ethers";
import type {
  LuxContract,
  LuxContractInterface,
} from "../../../../../contracts/Diamantaires/DestinationUtility/CyberDestinationUtilityFactoryFacet.sol/LuxContract";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class LuxContract__factory {
  static readonly abi = _abi;
  static createInterface(): LuxContractInterface {
    return new utils.Interface(_abi) as LuxContractInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LuxContract {
    return new Contract(address, _abi, signerOrProvider) as LuxContract;
  }
}
