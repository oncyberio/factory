// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

//import "hardhat/console.sol";
import '@solidstate/contracts/token/ERC1155/IERC1155.sol';
import './ERC1155URI/ERC1155URI.sol';
import './BaseRelayRecipient/BaseRelayRecipient.sol';

import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import './Diamond/LibDiamond.sol';
import './BaseRelayRecipient/BaseRelayRecipientStorage.sol';
import './libraries/LibAppStorage.sol';

contract CyberDestinationFactoryBase is BaseRelayRecipient, ERC1155URI {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  event Minted(
    address indexed account,
    uint256 indexed tokenId,
    uint256 indexed amount
  );

  function initialize(
    string memory _uri,
    address _manager,
    address _trustedForwarder,
    address _opensea,
    address _oncyber
  ) public virtual {
    require(LibDiamond.diamondStorage().contractOwner == msg.sender, 'NO');

    BaseRelayRecipientStorage.layout().trustedForwarder = _trustedForwarder;
    LibDiamond.diamondStorage().supportedInterfaces[
      type(IERC1155).interfaceId
    ] = true;
    setURI(_uri);
    LibAppStorage.layout().manager = _manager;
    LibAppStorage.layout().opensea = _opensea;
    LibAppStorage.layout().oncyber = _oncyber;
  }

  function totalSupply() public view returns (uint256) {
    return LibAppStorage.layout().totalSupply.current();
  }

  function manager() public view returns (address) {
    return LibAppStorage.layout().manager;
  }

  function oncyber() public view returns (address) {
    return LibAppStorage.layout().oncyber;
  }

  function minterNonce(address _minter) public view returns (uint256) {
    return LibAppStorage.layout().minterNonce[_minter].current();
  }
}
