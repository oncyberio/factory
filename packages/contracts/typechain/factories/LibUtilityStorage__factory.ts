/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  LibUtilityStorage,
  LibUtilityStorageInterface,
} from "../LibUtilityStorage";

const _abi = [
  {
    inputs: [],
    name: "STORAGE_SLOT",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a6610038600b82828239805160001a607314602b57634e487b7160e01b600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063517d217e146038575b600080fd5b605e7f75bce7b27cc8f04e7a4282e725010cbd105f602d082c4b02f7d958135d62562e81565b60405190815260200160405180910390f3fea2646970667358221220e9a5d61885f1e783b62882954ecb1425c2b4ec7bf2565cd1e398857988483b5864736f6c63430008070033";

export class LibUtilityStorage__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LibUtilityStorage> {
    return super.deploy(overrides || {}) as Promise<LibUtilityStorage>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): LibUtilityStorage {
    return super.attach(address) as LibUtilityStorage;
  }
  connect(signer: Signer): LibUtilityStorage__factory {
    return super.connect(signer) as LibUtilityStorage__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LibUtilityStorageInterface {
    return new utils.Interface(_abi) as LibUtilityStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LibUtilityStorage {
    return new Contract(address, _abi, signerOrProvider) as LibUtilityStorage;
  }
}
