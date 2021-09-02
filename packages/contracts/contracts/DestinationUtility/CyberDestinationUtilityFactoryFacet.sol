// SPDX-License-Identifier: MIT
pragma solidity 0.8.5;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "../CyberDestinationFactoryBase.sol";
import "../libraries/LibAppStorage.sol";
import "./LibUtilityStorage.sol";

contract CyberDestinationUtilityFactoryFacet is CyberDestinationFactoryBase {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  function getDrop(uint256 _tokenId) view public returns (LibUtilityStorage.Drop memory){

    LibUtilityStorage.Drop memory drop = LibUtilityStorage.layout().drops[_tokenId];
    require(drop.time_start != 0, "drop not exist");

    return drop;

  }


  function mint(string memory _uri, uint256 _time_start, uint256 _time_end, uint256 _price, uint256 _amount_cap, uint256 _share_oncyber, bytes memory _signature) public returns (uint256 _tokenId) {

    address sender = _msgSender();
    uint256 nonce = minterNonce(sender);
    require(_share_oncyber <= 100, "IAO");

    bytes memory _message = abi.encodePacked(_uri, _time_start, _time_end, _price, _amount_cap, _share_oncyber, nonce, sender);
    address _recoveredAddress = keccak256(_message).toEthSignedMessageHash().recover(_signature);
    require(_recoveredAddress == LibAppStorage.layout().manager, "NM");

    // Mint token
    _tokenId = LibAppStorage.layout().totalSupply.current();
    setTokenURI(_tokenId, _uri);
    LibAppStorage.layout().totalSupply.increment();
    LibAppStorage.layout().minterNonce[sender].increment();
    LibUtilityStorage.Drop memory drop = LibUtilityStorage.Drop({
      time_start: _time_start,
      time_end: _time_end,
      amount_cap: _amount_cap,
      share_oncyber: _share_oncyber,
      creator: payable(sender),
      price: _price,
      minted: 0
    });
    LibUtilityStorage.layout().drops[_tokenId] = drop;

    return _tokenId;

  }

  function mintEdition(uint256 _tokenId) public payable returns (bool){
    address sender = _msgSender();
    LibUtilityStorage.Drop storage drop = LibUtilityStorage.layout().drops[_tokenId];
//    console.log("timestamp %s drop.time_start %s drop.time_end %s", block.timestamp, drop.time_start, drop.time_end);
    require(block.timestamp >= drop.time_start && block.timestamp <= drop.time_end, "out of time");
    require(msg.value == drop.price, "invalid amount");
    if(drop.amount_cap != 0){
      require(drop.minted < drop.amount_cap, "cap reach");
    }
    drop.minted += 1;
    _safeMint(sender, _tokenId, 1, "");
    emit Minted(sender, _tokenId, 1);

    uint256 amountOnCyber = msg.value * drop.share_oncyber / 100;
    uint256 amountCreator = msg.value - amountOnCyber;

    drop.creator.transfer(amountCreator);
    payable(LibAppStorage.layout().oncyber).transfer(amountOnCyber);
    return true;

  }

}
