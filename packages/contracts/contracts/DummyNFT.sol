// contracts/GameItems.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC1155/ERC1155.sol';

contract DummyNFT is ERC1155 {
  uint256 public constant KONG = 1;
  uint256 public constant PUDGY = 2;

  constructor() ERC1155('https://dummy.example/api/item/{id}.json') {
    _mint(msg.sender, KONG, 10, '');
    _mint(msg.sender, PUDGY, 15, '');
  }
}
