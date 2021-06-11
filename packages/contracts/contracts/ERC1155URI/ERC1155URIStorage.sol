// SPDX-License-Identifier: MIT

pragma solidity 0.8.5;

library ERC1155URIStorage {
  bytes32 internal constant STORAGE_SLOT = keccak256(
    'diamond.storage.ERC1155URI'
  );

  struct Layout {
    mapping (uint256 => string) tokenURIs;
    string uri;
  }

  function layout() internal pure returns (Layout storage l) {
    bytes32 slot = STORAGE_SLOT;
    assembly { l.slot := slot }
  }

}
