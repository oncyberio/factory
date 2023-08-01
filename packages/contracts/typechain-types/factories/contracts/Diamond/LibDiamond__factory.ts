/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides, Signer, utils } from "ethers";
import type { PromiseOrValue } from "../../../common";
import type {
  LibDiamond,
  LibDiamondInterface,
} from "../../../contracts/Diamond/LibDiamond";

const _abi = [
  {
    inputs: [],
    name: "DIAMOND_STORAGE_POSITION",
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
  "0x60dc610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063b2bebf55146038575b600080fd5b603e6052565b60405160499190608d565b60405180910390f35b7fc8fcad8db84d3cc18b4c41d551ea0ee66dd599cde068d998e57d5e09332c131c81565b6000819050919050565b6087816076565b82525050565b600060208201905060a060008301846080565b9291505056fea2646970667358221220145f0d3c764a7494778e96dbaede559c3b1ca9c1fcc30043f744d093686e39bc64736f6c634300080f0033";

type LibDiamondConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LibDiamondConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LibDiamond__factory extends ContractFactory {
  constructor(...args: LibDiamondConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<LibDiamond> {
    return super.deploy(overrides || {}) as Promise<LibDiamond>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): LibDiamond {
    return super.attach(address) as LibDiamond;
  }
  override connect(signer: Signer): LibDiamond__factory {
    return super.connect(signer) as LibDiamond__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LibDiamondInterface {
    return new utils.Interface(_abi) as LibDiamondInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LibDiamond {
    return new Contract(address, _abi, signerOrProvider) as LibDiamond;
  }
}
