// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

//import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

library LibDropStorage {
  bytes32 public constant STORAGE_SLOT = keccak256('drop.app.storage');
  struct Drop {
    uint256 timeStart;
    uint256 timeEnd;
    uint256 priceStart;
    uint256 priceEnd;
    uint256 stepDuration;
    uint256 amountCap;
    uint256 shareCyber;
    address payable creator;
    Counters.Counter minted;
    mapping(address => Counters.Counter) mintCounter;
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
