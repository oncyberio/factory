// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

//import 'hardhat/console.sol';
import '../CyberDropBase.sol';

contract DropRandomCaller {
  function testMintRandom(
    CyberDropBase _cyberDropBase,
    uint256[] calldata _tokenIds,
    bytes memory _signature
  ) external payable {
    _cyberDropBase.mintRandom{value: msg.value}(_tokenIds, _signature);
  }
}
