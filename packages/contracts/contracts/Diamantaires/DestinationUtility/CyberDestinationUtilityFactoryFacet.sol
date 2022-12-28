// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import '../../CyberDropBase.sol';

abstract contract LuxContract {
    function mint(address newOwner, uint256 tokenId, uint256 amount) public virtual;
}

contract CyberDestinationUtilityFactoryFacet is CyberDropBase {
    address lootAddress = 0x3e96436B51B49d6f4dA8D4a0Bd4817Cd1F1719E0; // 0xb7be4001bff2c5f4a61dd2435e4c9a19d8d12343 in main
    uint256 lootId = 1;
    uint256 spacePodId = 1; // 5 in main

    address luxAddress = 0xf763DB874F2A6014440D0F87F39D8A2B38801a31;

    function burnTransfer(uint256 amount) public {
        bool isLux = amount == 20;
        require(amount == 2 || isLux, 'WA');

        ERC1155 lootPodContract = ERC1155(lootAddress);
        require(lootPodContract.balanceOf(msg.sender, lootId) >= amount, 'NR');
        require(balanceOf(msg.sender, spacePodId) >= amount, 'NS');
        
        _burn(msg.sender, spacePodId, amount);
        lootPodContract.safeTransferFrom(msg.sender, 0x000000000000000000000000000000000000dEaD, lootId, amount, '');

        // mint new contract
        LuxContract luxPodContract = LuxContract(luxAddress);
        luxPodContract.mint(msg.sender, isLux ? 2 : 1, 1);
    }
}