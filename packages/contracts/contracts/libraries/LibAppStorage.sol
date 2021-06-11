// SPDX-License-Identifier: MIT

pragma solidity 0.8.5;

import "@openzeppelin/contracts/utils/Counters.sol";
// import "hardhat/console.sol";

library LibAppStorage {
  bytes32 constant STORAGE_SLOT = keccak256("app.storage");

  struct Layout {

    address manager;
    address opensea;
    Counters.Counter totalSupply;
    mapping (address => Counters.Counter) minterNonce;
    address oncyber;

  }

  function layout() internal pure returns (Layout storage l) {
    bytes32 slot = STORAGE_SLOT;
    assembly { l.slot := slot }
  }

}
