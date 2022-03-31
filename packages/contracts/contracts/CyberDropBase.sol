// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

//import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import './libraries/LibAppStorage.sol';
import './libraries/LibDropStorage.sol';
import './CyberTokenBase.sol';

contract CyberDropBase is CyberTokenBase {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  event DropCreated(address indexed account, uint256 indexed tokenId);

  function dropMintCounter(uint256 _tokenId, address _minter)
    public
    view
    returns (uint256)
  {
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];
    require(drop.amountCap != 0, 'DNE');
    return drop.mintCounter[_minter].current();
  }

  function getDrop(uint256 _tokenId)
    public
    view
    returns (
      uint256 timeStart,
      uint256 timeEnd,
      uint256 price,
      uint256 amountCap,
      uint256 shareCyber,
      address creator,
      uint256 minted
    )
  {
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];

    return (
      drop.timeStart,
      drop.timeEnd,
      drop.price,
      drop.amountCap,
      drop.shareCyber,
      drop.creator,
      drop.minted.current()
    );
  }

  function createDrop(
    string memory _uri,
    uint256 _timeStart,
    uint256 _timeEnd,
    uint256 _price,
    uint256 _amountCap,
    uint256 _shareCyber,
    bytes memory _signature
  ) public returns (uint256 tokenId) {
    require(_timeEnd - _timeStart > 0, 'IT');
    require(_shareCyber <= 100, 'ISO');

    address sender = _msgSender();
    uint256 nonce = minterNonce(sender);
    bytes memory _message = abi.encodePacked(
      _uri,
      _timeStart,
      _timeEnd,
      _price,
      _amountCap,
      _shareCyber,
      sender,
      nonce
    );
    address recoveredAddress = keccak256(_message)
      .toEthSignedMessageHash()
      .recover(_signature);
    require(recoveredAddress == LibAppStorage.layout().manager, 'NM');
    tokenId = LibAppStorage.layout().totalSupply.current();

    // Effects
    setTokenURI(tokenId, _uri);
    LibAppStorage.layout().totalSupply.increment();

    LibAppStorage.layout().minterNonce[sender].increment();

    LibDropStorage.layout().drops[tokenId].timeStart = _timeStart;
    LibDropStorage.layout().drops[tokenId].timeEnd = _timeEnd;
    LibDropStorage.layout().drops[tokenId].price = _price;
    LibDropStorage.layout().drops[tokenId].amountCap = _amountCap;
    LibDropStorage.layout().drops[tokenId].shareCyber = _shareCyber;
    LibDropStorage.layout().drops[tokenId].creator = payable(sender);

    emit DropCreated(sender, tokenId);
  }

  function mint(
    uint256 _tokenId,
    uint256 _quantity,
    bytes memory _signature
  ) public payable returns (bool success) {
    address sender = _msgSender();
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];

    if (drop.amountCap != 0) {
      require(
        (drop.minted.current() < drop.amountCap) &&
          (drop.amountCap - drop.minted.current() >= _quantity),
        'CR'
      );
    }

    require(
      block.timestamp > drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );

    require(msg.value > drop.price * _quantity, 'IA');

    uint256 senderDropNonce = drop.mintCounter[sender].current();
    bytes memory _message = abi.encodePacked(
      _tokenId,
      _quantity,
      sender,
      senderDropNonce
    );
    address recoveredAddress = keccak256(_message)
      .toEthSignedMessageHash()
      .recover(_signature);

    require(recoveredAddress == LibAppStorage.layout().manager, 'NM');

    // Effects
    drop.minted.increment();
    drop.mintCounter[sender].increment();
    _safeMint(sender, _tokenId, _quantity, '');

    if (drop.price > 0) {
      uint256 amountOnCyber = (msg.value * drop.shareCyber) / 100;
      uint256 amountCreator = msg.value - amountOnCyber;

      drop.creator.transfer(amountCreator);
      payable(LibAppStorage.layout().oncyber).transfer(amountOnCyber);
    }

    emit Minted(sender, _tokenId, _quantity);

    return true;
  }
}
