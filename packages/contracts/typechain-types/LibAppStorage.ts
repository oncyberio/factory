/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface LibAppStorageInterface extends utils.Interface {
  functions: {
    "STORAGE_SLOT()": FunctionFragment;
    "c_0x6adf39b3(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "STORAGE_SLOT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "c_0x6adf39b3",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "STORAGE_SLOT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "c_0x6adf39b3",
    data: BytesLike
  ): Result;

  events: {};
}

export interface LibAppStorage extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LibAppStorageInterface;

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
    STORAGE_SLOT(overrides?: CallOverrides): Promise<[string]>;

    c_0x6adf39b3(
      c__0x6adf39b3: BytesLike,
      overrides?: CallOverrides
    ): Promise<[void]>;
  };

  STORAGE_SLOT(overrides?: CallOverrides): Promise<string>;

  c_0x6adf39b3(
    c__0x6adf39b3: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  callStatic: {
    STORAGE_SLOT(overrides?: CallOverrides): Promise<string>;

    c_0x6adf39b3(
      c__0x6adf39b3: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    STORAGE_SLOT(overrides?: CallOverrides): Promise<BigNumber>;

    c_0x6adf39b3(
      c__0x6adf39b3: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    STORAGE_SLOT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    c_0x6adf39b3(
      c__0x6adf39b3: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
