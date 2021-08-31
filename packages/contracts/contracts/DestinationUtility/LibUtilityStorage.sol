// SPDX-License-Identifier: MIT

pragma solidity 0.8.5;

// import "hardhat/console.sol";

library LibUtilityStorage {
  bytes32 constant STORAGE_SLOT = keccak256("utility.app.storage");
  struct Drop {
    uint256 time_start;
    uint256 time_end;
    uint256 share_oncyber;
    uint256 price;
    uint256 amount_cap;
    uint256 minted;
    address payable creator;
  }

  struct Layout {

    mapping(uint256 => Drop) drops;

  }

  function layout() internal pure returns (Layout storage l) {
    bytes32 slot = STORAGE_SLOT;
    assembly { l.slot := slot }
  }

}
