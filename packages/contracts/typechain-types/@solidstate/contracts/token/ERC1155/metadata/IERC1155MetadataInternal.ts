/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type { EventFragment } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  Signer,
  utils,
} from "ethers";
import type {
  OnEvent,
  PromiseOrValue,
  TypedEvent,
  TypedEventFilter,
  TypedListener,
} from "../../../../../common";

export interface IERC1155MetadataInternalInterface extends utils.Interface {
  functions: {};

  events: {
    "URI(string,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "URI"): EventFragment;
}

export interface URIEventObject {
  value: string;
  tokenId: BigNumber;
}
export type URIEvent = TypedEvent<[string, BigNumber], URIEventObject>;

export type URIEventFilter = TypedEventFilter<URIEvent>;

export interface IERC1155MetadataInternal extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IERC1155MetadataInternalInterface;

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

  functions: {};

  callStatic: {};

  filters: {
    "URI(string,uint256)"(
      value?: null,
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): URIEventFilter;
    URI(
      value?: null,
      tokenId?: PromiseOrValue<BigNumberish> | null
    ): URIEventFilter;
  };

  estimateGas: {};

  populateTransaction: {};
}
