/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers'
import { Provider, TransactionRequest } from '@ethersproject/providers'
import type {
  ERC1155URIStorage,
  ERC1155URIStorageInterface,
} from '../ERC1155URIStorage'

const _abi = [
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'c__0x64a239c3',
        type: 'bytes32',
      },
    ],
    name: 'c_0x64a239c3',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
]

const _bytecode =
  '0x60e7610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063da673181146038575b600080fd5b604e6004803603810190604a91906066565b6050565b005b50565b600081359050606081609d565b92915050565b60006020828403121560795760786098565b5b60006085848285016053565b91505092915050565b6000819050919050565b600080fd5b60a481608e565b811460ae57600080fd5b5056fea2646970667358221220e13cc92afc4e059b914c7f5f246f98138919f82f1bfac28e01c0bc291fdd1f7964736f6c63430008070033'

export class ERC1155URIStorage__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer)
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC1155URIStorage> {
    return super.deploy(overrides || {}) as Promise<ERC1155URIStorage>
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {})
  }
  attach(address: string): ERC1155URIStorage {
    return super.attach(address) as ERC1155URIStorage
  }
  connect(signer: Signer): ERC1155URIStorage__factory {
    return super.connect(signer) as ERC1155URIStorage__factory
  }
  static readonly bytecode = _bytecode
  static readonly abi = _abi
  static createInterface(): ERC1155URIStorageInterface {
    return new utils.Interface(_abi) as ERC1155URIStorageInterface
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155URIStorage {
    return new Contract(address, _abi, signerOrProvider) as ERC1155URIStorage
  }
}
