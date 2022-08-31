// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

//import 'hardhat/console.sol';
import '../../CyberDropBase.sol';

contract OnCyberAndFriendsFactoryFacet is CyberDropBase {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  function mintTransfer(
    address to,
    uint256 id,
    uint256 amount
  ) external virtual {
    uint256 tokenId = id + 14;
    require((id == 0 || id == 1) && (tokenId == 14 || tokenId == 15), 'NT');

    address sender = _msgSender();
    require(sender == 0xBf0562B81eF8E52316BDAF6f36948Fd8bE82fCC8, 'NS');

    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[tokenId];
    require(drop.amountCap - drop.minted >= amount, 'CR');
    require(block.timestamp > drop.timeStart && block.timestamp <= drop.timeEnd, 'OOT');


    // Effects
    drop.minted += amount;
    drop.mintCounter[to].increment();
    _safeMint(to, tokenId, amount, '');

    emit Minted(to, tokenId, amount);
  }
}
