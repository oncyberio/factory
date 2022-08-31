/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides, Signer, utils } from "ethers";
import type { PromiseOrValue } from "../../../common";
import type {
  LibDropStorage,
  LibDropStorageInterface,
} from "../../../contracts/libraries/LibDropStorage";

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
  "0x60dc610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063517d217e146038575b600080fd5b603e6052565b60405160499190608d565b60405180910390f35b7f6862122c88c20d0f389f9211fb45e4a0982f5f74838cd11cfb5e8c8b41fbe65981565b6000819050919050565b6087816076565b82525050565b600060208201905060a060008301846080565b9291505056fea26469706673582212208bcc5682c2f3e98fddcfb5c9152107959c0c07fa530d9aa5dfcacdabc74a167064736f6c634300080f0033";

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

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<LibDropStorage> {
    return super.deploy(overrides || {}) as Promise<LibDropStorage>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): LibDropStorage {
    return super.attach(address) as LibDropStorage;
  }
  override connect(signer: Signer): LibDropStorage__factory {
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
