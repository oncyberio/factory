/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  BaseRelayRecipientStorage,
  BaseRelayRecipientStorageInterface,
} from "../BaseRelayRecipientStorage";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "c__0x51858802",
        type: "bytes32",
      },
    ],
    name: "c_0x51858802",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60e7610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063ae9e5f84146038575b600080fd5b604e6004803603810190604a91906089565b6050565b005b50565b600080fd5b6000819050919050565b6069816058565b8114607357600080fd5b50565b6000813590506083816062565b92915050565b600060208284031215609c57609b6053565b5b600060a8848285016076565b9150509291505056fea264697066735822122097d985af3db8384ce4ed2b7141a1bb4f09c43fe00bcf3ba194cd8d3b0304226c64736f6c634300080a0033";

type BaseRelayRecipientStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BaseRelayRecipientStorageConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BaseRelayRecipientStorage__factory extends ContractFactory {
  constructor(...args: BaseRelayRecipientStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BaseRelayRecipientStorage> {
    return super.deploy(overrides || {}) as Promise<BaseRelayRecipientStorage>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BaseRelayRecipientStorage {
    return super.attach(address) as BaseRelayRecipientStorage;
  }
  connect(signer: Signer): BaseRelayRecipientStorage__factory {
    return super.connect(signer) as BaseRelayRecipientStorage__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BaseRelayRecipientStorageInterface {
    return new utils.Interface(_abi) as BaseRelayRecipientStorageInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BaseRelayRecipientStorage {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as BaseRelayRecipientStorage;
  }
}
