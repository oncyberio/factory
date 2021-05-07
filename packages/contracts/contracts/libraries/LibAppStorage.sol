// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";

// import "hardhat/console.sol";

struct AppStorage {
  // ERC1155
  // Mapping from token ID to account balances
  mapping (uint256 => mapping(address => uint256)) _balances;
  // Mapping from account to operator approvals
  mapping (address => mapping(address => bool)) _operatorApprovals;
  // Used as the URI for all token types by relying on ID substitution, e.g. https://token-cdn-domain/{id}.json
  string _uri;

  // ERC1155URIStorage
  mapping (uint256 => string) _tokenURIs;

  // OnCyberScenesFacet
  address manager;
  address opensea;
  Counters.Counter totalSupply;
  mapping (address => Counters.Counter) minterNonce;


  // BaseRelayRecipient
  /*
   * Forwarder singleton we accept calls from
   */
  address trustedForwarder;

}

library LibAppStorage {
  bytes32 constant APP_STORAGE_POSITION = keccak256("diamond.standard.app.storage");

  function diamondStorage() internal pure returns (AppStorage storage ds) {
    bytes32 position = APP_STORAGE_POSITION;
    assembly {
      ds.slot := position
    }
  }

}
