// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

library BaseRelayRecipientStorage {
  bytes32 internal constant STORAGE_SLOT =
    keccak256('diamond.storage.BaseRelayRecipientStorage');

  struct Layout {
    /*
     * Forwarder singleton we accept calls from
     */
    address trustedForwarder;
  }

  function layout() internal pure returns (Layout storage layout) {
    bytes32 slot = STORAGE_SLOT;
    assembly {
      layout.slot := slot
    }
  }
}
