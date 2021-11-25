/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface CyberDestinationFactoryFacetInterface
  extends ethers.utils.Interface {
  functions: {
    "accountsByToken(uint256)": FunctionFragment;
    "balanceOf(address,uint256)": FunctionFragment;
    "balanceOfBatch(address[],uint256[])": FunctionFragment;
    "c_0x0355af73(bytes32)": FunctionFragment;
    "c_0x0cb09206(bytes32)": FunctionFragment;
    "c_0x68791152(bytes32)": FunctionFragment;
    "c_0x792934de(bytes32)": FunctionFragment;
    "c_0xd4dc4272(bytes32)": FunctionFragment;
    "createDrop(string,uint256,uint256,uint256,uint256,uint256,uint256,uint256,bytes)": FunctionFragment;
    "dropMintCounter(uint256,address)": FunctionFragment;
    "getDrop(uint256)": FunctionFragment;
    "getMintPriceForToken(uint256)": FunctionFragment;
    "getPriceFor(uint256,uint256,uint256,uint256,uint256)": FunctionFragment;
    "initialize(string,address,address,address,address)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "isTrustedForwarder(address)": FunctionFragment;
    "manager()": FunctionFragment;
    "mint(uint256,bytes)": FunctionFragment;
    "minterNonce(address)": FunctionFragment;
    "oncyber()": FunctionFragment;
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)": FunctionFragment;
    "safeTransferFrom(address,address,uint256,uint256,bytes)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "tokensByAccount(address)": FunctionFragment;
    "totalHolders(uint256)": FunctionFragment;
    "totalSupply()": FunctionFragment;
    "uri(uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accountsByToken",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOfBatch",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "c_0x0355af73",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "c_0x0cb09206",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "c_0x68791152",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "c_0x792934de",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "c_0xd4dc4272",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "createDrop",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "dropMintCounter",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getDrop",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getMintPriceForToken",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPriceFor",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values: [string, string, string, string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(
    functionFragment: "isTrustedForwarder",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "manager", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "minterNonce", values: [string]): string;
  encodeFunctionData(functionFragment: "oncyber", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "safeBatchTransferFrom",
    values: [string, string, BigNumberish[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "tokensByAccount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "totalHolders",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "uri", values: [BigNumberish]): string;

  decodeFunctionResult(
    functionFragment: "accountsByToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "balanceOfBatch",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "c_0x0355af73",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "c_0x0cb09206",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "c_0x68791152",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "c_0x792934de",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "c_0xd4dc4272",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "createDrop", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "dropMintCounter",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getDrop", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getMintPriceForToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPriceFor",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isTrustedForwarder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "manager", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "minterNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "oncyber", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "safeBatchTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tokensByAccount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalHolders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "uri", data: BytesLike): Result;

  events: {
    "ApprovalForAll(address,address,bool)": EventFragment;
    "DropCreated(address,uint256)": EventFragment;
    "Minted(address,uint256,uint256)": EventFragment;
    "TransferBatch(address,address,address,uint256[],uint256[])": EventFragment;
    "TransferSingle(address,address,address,uint256,uint256)": EventFragment;
    "URI(string,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DropCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Minted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferBatch"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TransferSingle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
}

export type ApprovalForAllEvent = TypedEvent<
  [string, string, boolean],
  { account: string; operator: string; approved: boolean }
>;

export type ApprovalForAllEventFilter = TypedEventFilter<ApprovalForAllEvent>;

export type DropCreatedEvent = TypedEvent<
  [string, BigNumber],
  { account: string; tokenId: BigNumber }
>;

export type DropCreatedEventFilter = TypedEventFilter<DropCreatedEvent>;

export type MintedEvent = TypedEvent<
  [string, BigNumber, BigNumber],
  { account: string; tokenId: BigNumber; amount: BigNumber }
>;

export type MintedEventFilter = TypedEventFilter<MintedEvent>;

export type TransferBatchEvent = TypedEvent<
  [string, string, string, BigNumber[], BigNumber[]],
  {
    operator: string;
    from: string;
    to: string;
    ids: BigNumber[];
    values: BigNumber[];
  }
>;

export type TransferBatchEventFilter = TypedEventFilter<TransferBatchEvent>;

export type TransferSingleEvent = TypedEvent<
  [string, string, string, BigNumber, BigNumber],
  {
    operator: string;
    from: string;
    to: string;
    id: BigNumber;
    value: BigNumber;
  }
>;

export type TransferSingleEventFilter = TypedEventFilter<TransferSingleEvent>;

export type URIEvent = TypedEvent<
  [string, BigNumber],
  { value: string; tokenId: BigNumber }
>;

export type URIEventFilter = TypedEventFilter<URIEvent>;

export interface CyberDestinationFactoryFacet extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CyberDestinationFactoryFacetInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    accountsByToken(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string[]]>;

    balanceOf(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    c_0x0355af73(
      c__0x0355af73: BytesLike,
      overrides?: CallOverrides
    ): Promise<[void]>;

    c_0x0cb09206(
      c__0x0cb09206: BytesLike,
      overrides?: CallOverrides
    ): Promise<[void]>;

    c_0x68791152(
      c__0x68791152: BytesLike,
      overrides?: CallOverrides
    ): Promise<[void]>;

    c_0x792934de(
      c__0x792934de: BytesLike,
      overrides?: CallOverrides
    ): Promise<[void]>;

    c_0xd4dc4272(
      c__0xd4dc4272: BytesLike,
      overrides?: CallOverrides
    ): Promise<[void]>;

    createDrop(
      _uri: string,
      _timeStart: BigNumberish,
      _timeEnd: BigNumberish,
      _priceStart: BigNumberish,
      _priceEnd: BigNumberish,
      _stepDuration: BigNumberish,
      _amountCap: BigNumberish,
      _shareCyber: BigNumberish,
      _signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    dropMintCounter(
      _tokenId: BigNumberish,
      _minter: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { dropMintCounter: BigNumber }>;

    getDrop(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        BigNumber
      ] & {
        timeStart: BigNumber;
        timeEnd: BigNumber;
        priceStart: BigNumber;
        priceEnd: BigNumber;
        stepDuration: BigNumber;
        amountCap: BigNumber;
        shareCyber: BigNumber;
        creator: string;
        minted: BigNumber;
      }
    >;

    getMintPriceForToken(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { mintPrice: BigNumber }>;

    getPriceFor(
      _timeSpent: BigNumberish,
      _duration: BigNumberish,
      _priceStart: BigNumberish,
      _priceEnd: BigNumberish,
      _stepDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { price: BigNumber }>;

    initialize(
      _uri: string,
      _manager: string,
      _trustedForwarder: string,
      _opensea: string,
      _oncyber: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    manager(overrides?: CallOverrides): Promise<[string] & { manager: string }>;

    mint(
      _tokenId: BigNumberish,
      _signature: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    minterNonce(
      _minter: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { minterNonce: BigNumber }>;

    oncyber(overrides?: CallOverrides): Promise<[string] & { oncyber: string }>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    tokensByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    totalHolders(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    "totalSupply()"(
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { totalSupply: BigNumber }>;

    "totalSupply(uint256)"(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    uri(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<[string]>;
  };

  accountsByToken(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string[]>;

  balanceOf(
    account: string,
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  balanceOfBatch(
    accounts: string[],
    ids: BigNumberish[],
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  c_0x0355af73(
    c__0x0355af73: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  c_0x0cb09206(
    c__0x0cb09206: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  c_0x68791152(
    c__0x68791152: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  c_0x792934de(
    c__0x792934de: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  c_0xd4dc4272(
    c__0xd4dc4272: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  createDrop(
    _uri: string,
    _timeStart: BigNumberish,
    _timeEnd: BigNumberish,
    _priceStart: BigNumberish,
    _priceEnd: BigNumberish,
    _stepDuration: BigNumberish,
    _amountCap: BigNumberish,
    _shareCyber: BigNumberish,
    _signature: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  dropMintCounter(
    _tokenId: BigNumberish,
    _minter: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getDrop(
    _tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      BigNumber,
      string,
      BigNumber
    ] & {
      timeStart: BigNumber;
      timeEnd: BigNumber;
      priceStart: BigNumber;
      priceEnd: BigNumber;
      stepDuration: BigNumber;
      amountCap: BigNumber;
      shareCyber: BigNumber;
      creator: string;
      minted: BigNumber;
    }
  >;

  getMintPriceForToken(
    _tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getPriceFor(
    _timeSpent: BigNumberish,
    _duration: BigNumberish,
    _priceStart: BigNumberish,
    _priceEnd: BigNumberish,
    _stepDuration: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  initialize(
    _uri: string,
    _manager: string,
    _trustedForwarder: string,
    _opensea: string,
    _oncyber: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isApprovedForAll(
    account: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isTrustedForwarder(
    forwarder: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  manager(overrides?: CallOverrides): Promise<string>;

  mint(
    _tokenId: BigNumberish,
    _signature: BytesLike,
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  minterNonce(_minter: string, overrides?: CallOverrides): Promise<BigNumber>;

  oncyber(overrides?: CallOverrides): Promise<string>;

  safeBatchTransferFrom(
    from: string,
    to: string,
    ids: BigNumberish[],
    amounts: BigNumberish[],
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  safeTransferFrom(
    from: string,
    to: string,
    id: BigNumberish,
    amount: BigNumberish,
    data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    status: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  tokensByAccount(
    account: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  totalHolders(id: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

  "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

  "totalSupply(uint256)"(
    id: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  uri(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  callStatic: {
    accountsByToken(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string[]>;

    balanceOf(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    c_0x0355af73(
      c__0x0355af73: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    c_0x0cb09206(
      c__0x0cb09206: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    c_0x68791152(
      c__0x68791152: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    c_0x792934de(
      c__0x792934de: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    c_0xd4dc4272(
      c__0xd4dc4272: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    createDrop(
      _uri: string,
      _timeStart: BigNumberish,
      _timeEnd: BigNumberish,
      _priceStart: BigNumberish,
      _priceEnd: BigNumberish,
      _stepDuration: BigNumberish,
      _amountCap: BigNumberish,
      _shareCyber: BigNumberish,
      _signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    dropMintCounter(
      _tokenId: BigNumberish,
      _minter: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDrop(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber,
        string,
        BigNumber
      ] & {
        timeStart: BigNumber;
        timeEnd: BigNumber;
        priceStart: BigNumber;
        priceEnd: BigNumber;
        stepDuration: BigNumber;
        amountCap: BigNumber;
        shareCyber: BigNumber;
        creator: string;
        minted: BigNumber;
      }
    >;

    getMintPriceForToken(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPriceFor(
      _timeSpent: BigNumberish,
      _duration: BigNumberish,
      _priceStart: BigNumberish,
      _priceEnd: BigNumberish,
      _stepDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _uri: string,
      _manager: string,
      _trustedForwarder: string,
      _opensea: string,
      _oncyber: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    manager(overrides?: CallOverrides): Promise<string>;

    mint(
      _tokenId: BigNumberish,
      _signature: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    minterNonce(_minter: string, overrides?: CallOverrides): Promise<BigNumber>;

    oncyber(overrides?: CallOverrides): Promise<string>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      status: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    tokensByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    totalHolders(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply(uint256)"(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    uri(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "ApprovalForAll(address,address,bool)"(
      account?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;
    ApprovalForAll(
      account?: string | null,
      operator?: string | null,
      approved?: null
    ): ApprovalForAllEventFilter;

    "DropCreated(address,uint256)"(
      account?: string | null,
      tokenId?: BigNumberish | null
    ): DropCreatedEventFilter;
    DropCreated(
      account?: string | null,
      tokenId?: BigNumberish | null
    ): DropCreatedEventFilter;

    "Minted(address,uint256,uint256)"(
      account?: string | null,
      tokenId?: BigNumberish | null,
      amount?: BigNumberish | null
    ): MintedEventFilter;
    Minted(
      account?: string | null,
      tokenId?: BigNumberish | null,
      amount?: BigNumberish | null
    ): MintedEventFilter;

    "TransferBatch(address,address,address,uint256[],uint256[])"(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      ids?: null,
      values?: null
    ): TransferBatchEventFilter;
    TransferBatch(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      ids?: null,
      values?: null
    ): TransferBatchEventFilter;

    "TransferSingle(address,address,address,uint256,uint256)"(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      id?: null,
      value?: null
    ): TransferSingleEventFilter;
    TransferSingle(
      operator?: string | null,
      from?: string | null,
      to?: string | null,
      id?: null,
      value?: null
    ): TransferSingleEventFilter;

    "URI(string,uint256)"(
      value?: null,
      tokenId?: BigNumberish | null
    ): URIEventFilter;
    URI(value?: null, tokenId?: BigNumberish | null): URIEventFilter;
  };

  estimateGas: {
    accountsByToken(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOf(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    c_0x0355af73(
      c__0x0355af73: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    c_0x0cb09206(
      c__0x0cb09206: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    c_0x68791152(
      c__0x68791152: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    c_0x792934de(
      c__0x792934de: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    c_0xd4dc4272(
      c__0xd4dc4272: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createDrop(
      _uri: string,
      _timeStart: BigNumberish,
      _timeEnd: BigNumberish,
      _priceStart: BigNumberish,
      _priceEnd: BigNumberish,
      _stepDuration: BigNumberish,
      _amountCap: BigNumberish,
      _shareCyber: BigNumberish,
      _signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    dropMintCounter(
      _tokenId: BigNumberish,
      _minter: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getDrop(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getMintPriceForToken(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPriceFor(
      _timeSpent: BigNumberish,
      _duration: BigNumberish,
      _priceStart: BigNumberish,
      _priceEnd: BigNumberish,
      _stepDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      _uri: string,
      _manager: string,
      _trustedForwarder: string,
      _opensea: string,
      _oncyber: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    manager(overrides?: CallOverrides): Promise<BigNumber>;

    mint(
      _tokenId: BigNumberish,
      _signature: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    minterNonce(_minter: string, overrides?: CallOverrides): Promise<BigNumber>;

    oncyber(overrides?: CallOverrides): Promise<BigNumber>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokensByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    totalHolders(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "totalSupply()"(overrides?: CallOverrides): Promise<BigNumber>;

    "totalSupply(uint256)"(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    uri(_tokenId: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    accountsByToken(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOf(
      account: string,
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    balanceOfBatch(
      accounts: string[],
      ids: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    c_0x0355af73(
      c__0x0355af73: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    c_0x0cb09206(
      c__0x0cb09206: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    c_0x68791152(
      c__0x68791152: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    c_0x792934de(
      c__0x792934de: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    c_0xd4dc4272(
      c__0xd4dc4272: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createDrop(
      _uri: string,
      _timeStart: BigNumberish,
      _timeEnd: BigNumberish,
      _priceStart: BigNumberish,
      _priceEnd: BigNumberish,
      _stepDuration: BigNumberish,
      _amountCap: BigNumberish,
      _shareCyber: BigNumberish,
      _signature: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    dropMintCounter(
      _tokenId: BigNumberish,
      _minter: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getDrop(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getMintPriceForToken(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPriceFor(
      _timeSpent: BigNumberish,
      _duration: BigNumberish,
      _priceStart: BigNumberish,
      _priceEnd: BigNumberish,
      _stepDuration: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      _uri: string,
      _manager: string,
      _trustedForwarder: string,
      _opensea: string,
      _oncyber: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      account: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isTrustedForwarder(
      forwarder: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    manager(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    mint(
      _tokenId: BigNumberish,
      _signature: BytesLike,
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    minterNonce(
      _minter: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    oncyber(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    safeBatchTransferFrom(
      from: string,
      to: string,
      ids: BigNumberish[],
      amounts: BigNumberish[],
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    safeTransferFrom(
      from: string,
      to: string,
      id: BigNumberish,
      amount: BigNumberish,
      data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokensByAccount(
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    totalHolders(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "totalSupply()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "totalSupply(uint256)"(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    uri(
      _tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
