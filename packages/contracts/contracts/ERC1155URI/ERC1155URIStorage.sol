// SPDX-License-Identifier: MIT

pragma solidity 0.8.7;

library ERC1155URIStorage {
  bytes32 internal constant STORAGESLOT =
    keccak256('diamond.storage.ERC1155URI');

  struct Layout {
    mapping(uint256 => string) tokenURIs;
    string uri;
  }

  function layout() internal pure returns (Layout storage layout) {
    bytes32 slot = STORAGESLOT;
    assembly {
      layout.slot := slot
    }
  }
}
