/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  LibDropStorage,
  LibDropStorageInterface,
} from "../LibDropStorage";

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
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "c__0x54377202",
        type: "bytes32",
      },
    ],
    name: "c_0x54377202",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x61016e610053600b82828239805160001a607314610046577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe73000000000000000000000000000000000000000030146080604052600436106100405760003560e01c8063517d217e146100455780636b5b47dd14610063575b600080fd5b61004d61007f565b60405161005a91906100bf565b60405180910390f35b61007d6004803603810190610078919061010b565b6100a3565b005b7f6862122c88c20d0f389f9211fb45e4a0982f5f74838cd11cfb5e8c8b41fbe65981565b50565b6000819050919050565b6100b9816100a6565b82525050565b60006020820190506100d460008301846100b0565b92915050565b600080fd5b6100e8816100a6565b81146100f357600080fd5b50565b600081359050610105816100df565b92915050565b600060208284031215610121576101206100da565b5b600061012f848285016100f6565b9150509291505056fea26469706673582212205593ea09e9e7977638fe5f085396ba055712b0c341a735bc86eecf6e9b215cad64736f6c634300080a0033";

type LibDropStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LibDropStorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LibDropStorage__factory extends ContractFactory {
  constructor(...args: LibDropStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<LibDropStorage> {
    return super.deploy(overrides || {}) as Promise<LibDropStorage>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): LibDropStorage {
    return super.attach(address) as LibDropStorage;
  }
  connect(signer: Signer): LibDropStorage__factory {
    return super.connect(signer) as LibDropStorage__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LibDropStorageInterface {
    return new utils.Interface(_abi) as LibDropStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LibDropStorage {
    return new Contract(address, _abi, signerOrProvider) as LibDropStorage;
  }
}
