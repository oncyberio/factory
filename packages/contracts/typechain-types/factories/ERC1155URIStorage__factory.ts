/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  ERC1155URIStorage,
  ERC1155URIStorageInterface,
} from "../ERC1155URIStorage";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "c__0x281cd3c6",
        type: "bytes32",
      },
    ],
    name: "c_0x281cd3c6",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60e7610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063da46093b146038575b600080fd5b604e6004803603810190604a91906089565b6050565b005b50565b600080fd5b6000819050919050565b6069816058565b8114607357600080fd5b50565b6000813590506083816062565b92915050565b600060208284031215609c57609b6053565b5b600060a8848285016076565b9150509291505056fea2646970667358221220e46bb0895cea70bfdafa43ed97292978076ee7ed04c51a1150a65a445b1da74b64736f6c634300080a0033";

type ERC1155URIStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155URIStorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155URIStorage__factory extends ContractFactory {
  constructor(...args: ERC1155URIStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC1155URIStorage> {
    return super.deploy(overrides || {}) as Promise<ERC1155URIStorage>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ERC1155URIStorage {
    return super.attach(address) as ERC1155URIStorage;
  }
  connect(signer: Signer): ERC1155URIStorage__factory {
    return super.connect(signer) as ERC1155URIStorage__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155URIStorageInterface {
    return new utils.Interface(_abi) as ERC1155URIStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155URIStorage {
    return new Contract(address, _abi, signerOrProvider) as ERC1155URIStorage;
  }
}
