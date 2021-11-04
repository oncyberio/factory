// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

//import 'hardhat/console.sol';

library LibDropStorage {
  bytes32 public constant STORAGE_SLOT = keccak256('drop.app.storage');
  struct Drop {
    uint256 timeStart;
    uint256 timeEnd;
    uint256 shareCyber;
    uint256 price;
    uint256 amountCap;
    uint256 minted;
    address payable creator;
  }

  struct Layout {
    mapping(uint256 => Drop) drops;
  }

  function layout() internal pure returns (Layout storage layout) {
    bytes32 slot = STORAGE_SLOT;
    assembly {
      layout.slot := slot
    }
  }
}
