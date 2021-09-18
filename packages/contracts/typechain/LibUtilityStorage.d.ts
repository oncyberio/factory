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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface LibUtilityStorageInterface extends ethers.utils.Interface {
  functions: {
    "STORAGE_SLOT()": FunctionFragment;
    "c_0x034c1ab8(bytes32)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "STORAGE_SLOT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "c_0x034c1ab8",
    values: [BytesLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "STORAGE_SLOT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "c_0x034c1ab8",
    data: BytesLike
  ): Result;

  events: {};
}

export class LibUtilityStorage extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: LibUtilityStorageInterface;

  functions: {
    STORAGE_SLOT(overrides?: CallOverrides): Promise<[string]>;

    c_0x034c1ab8(
      c__0x034c1ab8: BytesLike,
      overrides?: CallOverrides
    ): Promise<[void]>;
  };

  STORAGE_SLOT(overrides?: CallOverrides): Promise<string>;

  c_0x034c1ab8(
    c__0x034c1ab8: BytesLike,
    overrides?: CallOverrides
  ): Promise<void>;

  callStatic: {
    STORAGE_SLOT(overrides?: CallOverrides): Promise<string>;

    c_0x034c1ab8(
      c__0x034c1ab8: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    STORAGE_SLOT(overrides?: CallOverrides): Promise<BigNumber>;

    c_0x034c1ab8(
      c__0x034c1ab8: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    STORAGE_SLOT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    c_0x034c1ab8(
      c__0x034c1ab8: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}