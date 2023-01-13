// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import '../../CyberDropBase.sol';

abstract contract LuxContract {
  function mint(
    address newOwner,
    uint256 tokenId,
    uint256 amount
  ) public virtual;
}

contract CyberDestinationUtilityFactoryFacet is CyberDropBase {
  function burnTransfer(uint256 quantity, bool isLux) public {
    uint256 toBurn = isLux ? quantity * 20 : quantity * 2;

    ERC1155 lootPodContract = ERC1155(0x3e96436B51B49d6f4dA8D4a0Bd4817Cd1F1719E0);
    require(lootPodContract.balanceOf(msg.sender, 1) >= toBurn, 'NR');
    require(balanceOf(msg.sender, 1) >= toBurn, 'NS');

    _burn(msg.sender, 1, toBurn);
    lootPodContract.safeTransferFrom(msg.sender, 0x000000000000000000000000000000000000dEaD, 1, toBurn, '');

    // mint new token
    LuxContract luxPodContract = LuxContract(0xf763DB874F2A6014440D0F87F39D8A2B38801a31);
    luxPodContract.mint(msg.sender, isLux ? 2 : 1, quantity);
  }
}