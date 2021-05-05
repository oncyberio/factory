//SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC1155URIStorage.sol";

contract OnCyberScenes is ERC1155URIStorage {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  event Minted(address account, uint256 indexed tokenId, uint256 indexed amount);

  Counters.Counter public totalSupply;

  address public manager;

  constructor(address _manager) ERC1155("ipfs://") {
    manager = _manager;
  }

  function changeManager(address _newManager) public returns (bool){

    require(msg.sender == manager, "NM");
    manager = _newManager;
    return true;

  }

  function mint(string memory _uri, uint256 _amount, bytes memory _signature) public returns (uint256 _tokenId) {

    address sender = _msgSender();

    bytes memory _message = abi.encodePacked(_uri, _amount, sender);
    address _recoveredAddress = keccak256(_message).toEthSignedMessageHash().recover(_signature);
    require(manager == _recoveredAddress, "NM");

    // Mint token
    _tokenId = totalSupply.current();
    _setTokenURI(_tokenId, _uri);
    totalSupply.increment();
    _mint(sender, _tokenId, _amount, "");

    emit Minted(sender, _tokenId, _amount);
    return _tokenId;

  }

}
