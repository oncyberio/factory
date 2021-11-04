// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

//import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import '../libraries/LibAppStorage.sol';
import '../libraries/LibDropStorage.sol';
import '../CyberDropBase.sol';

contract CyberDestinationUtilityFactoryFacet is CyberDropBase {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  function mintEdition(uint256 _tokenId) public payable returns (bool) {
    address sender = _msgSender();
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];

    require(
      block.timestamp >= drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );

    require(msg.value == drop.price, 'IA');

    if (drop.amountCap != 0) {
      require(drop.minted < drop.amountCap, 'CR');
    }

    _safeMint(sender, _tokenId, 1, '');
    drop.minted += 1;
    emit Minted(sender, _tokenId, 1);

    uint256 amountOnCyber = (msg.value * drop.shareCyber) / 100;
    uint256 amountCreator = msg.value - amountOnCyber;

    drop.creator.transfer(amountCreator);
    payable(LibAppStorage.layout().oncyber).transfer(amountOnCyber);
    return true;
  }
}
