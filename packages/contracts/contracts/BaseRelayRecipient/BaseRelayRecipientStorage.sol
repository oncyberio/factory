// SPDX-License-Identifier: MIT

pragma solidity 0.8.15;

library BaseRelayRecipientStorage {
  bytes32 internal constant STORAGE_SLOT = keccak256('diamond.storage.BaseRelayRecipientStorage');

  struct Layout {
    /*
     * Forwarder singleton we accept calls from
     */
    address trustedForwarder;
  }

  function layout() internal pure returns (Layout storage lay) {
    bytes32 slot = STORAGE_SLOT;
    assembly {
      lay.slot := slot
    }
  }
}
