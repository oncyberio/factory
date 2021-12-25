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

export interface LibDiamondInterface extends utils.Interface {
  functions: {
    "DIAMOND_STORAGE_POSITION()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "DIAMOND_STORAGE_POSITION",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "DIAMOND_STORAGE_POSITION",
    data: BytesLike
  ): Result;

  events: {};
}

export interface LibDiamond extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: LibDiamondInterface;

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
    DIAMOND_STORAGE_POSITION(overrides?: CallOverrides): Promise<[string]>;
  };

  DIAMOND_STORAGE_POSITION(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    DIAMOND_STORAGE_POSITION(overrides?: CallOverrides): Promise<string>;
  };

  filters: {};

  estimateGas: {
    DIAMOND_STORAGE_POSITION(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    DIAMOND_STORAGE_POSITION(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
