// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import '../../CyberDropBase.sol';

abstract contract LuxContract {
  function mintThroughBurn(
    address newOwner,
    uint256 tokenId,
    uint256 amount
  ) public virtual;
}

contract CyberDestinationUtilityFactoryFacet is CyberDropBase {
  function burnTransfer(uint256 quantity, bool isLux) public {
    // definitions
    uint256 toBurn = isLux ? quantity * 20 : quantity * 2;
    ERC1155 lootPodContract = ERC1155(0xb7bE4001BfF2c5F4a61dd2435E4c9A19D8d12343); // replace with 0xb7be4001bff2c5f4a61dd2435e4c9a19d8d12343

    // check balance
    require(balanceOf(msg.sender, 5) >= toBurn, 'NS'); // replace with 5
    require(lootPodContract.balanceOf(msg.sender, 1) >= toBurn, 'NR');

    // burn mechanisms
    lootPodContract.safeTransferFrom(msg.sender, 0x000000000000000000000000000000000000dEaD, 1, toBurn, '');
    _burn(msg.sender, 5, toBurn); // replace with 5

    // mint new token
    LuxContract luxPodContract = LuxContract(0x895554bc4F48fe1c2bf5C198bFA3513Da538f86b); // replace w new rtfkt contract
    luxPodContract.mintThroughBurn(msg.sender, isLux ? 2 : 1, quantity);
  }

  function updateTokenURI(uint256 tokenId, string memory _tokenURI) public {
    LibAppStorage.Layout storage layout = LibAppStorage.layout();
    require(msg.sender == layout.manager, 'NM');
    
    setTokenURI(tokenId, _tokenURI);
  }
}
