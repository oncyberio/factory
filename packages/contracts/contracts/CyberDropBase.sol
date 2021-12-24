// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

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
    require(drop.priceStart != 0, 'DNE');
    return drop.mintCounter[_minter].current();
  }

  function getDrop(uint256 _tokenId)
    public
    view
    returns (
      uint256 timeStart,
      uint256 timeEnd,
      uint256 priceStart,
      uint256 priceEnd,
      uint256 stepDuration,
      uint256 amountCap,
      uint256 shareCyber,
      address creator,
      uint256 minted
    )
  {
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];
    require(drop.priceStart != 0, 'DNE');

    return (
      drop.timeStart,
      drop.timeEnd,
      drop.priceStart,
      drop.priceEnd,
      drop.stepDuration,
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
    uint256 _priceStart,
    uint256 _priceEnd,
    uint256 _stepDuration,
    uint256 _amountCap,
    uint256 _shareCyber,
    bytes memory _signature
  ) public returns (uint256 tokenId) {
    require(_timeEnd - _timeStart >= _stepDuration && _stepDuration > 0, 'IT');
    require(_priceStart >= _priceEnd && _priceStart > 0, 'IP');
    require(_shareCyber <= 100, 'ISO');

    address sender = _msgSender();
    uint256 nonce = minterNonce(sender);
    bytes memory _message = abi.encodePacked(
      _uri,
      _timeStart,
      _timeEnd,
      _priceStart,
      _priceEnd,
      _stepDuration,
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
    LibDropStorage.layout().drops[tokenId].priceStart = _priceStart;
    LibDropStorage.layout().drops[tokenId].priceEnd = _priceEnd;
    LibDropStorage.layout().drops[tokenId].stepDuration = _stepDuration;
    LibDropStorage.layout().drops[tokenId].amountCap = _amountCap;
    LibDropStorage.layout().drops[tokenId].shareCyber = _shareCyber;
    LibDropStorage.layout().drops[tokenId].creator = payable(sender);

    // Mint for creator
    LibDropStorage.layout().drops[tokenId].minted.increment();
    LibDropStorage.layout().drops[tokenId].mintCounter[sender].increment();
    _safeMint(sender, tokenId, 1, '');

    emit DropCreated(sender, tokenId);
    emit Minted(sender, tokenId, 1);
  }

  function mint(uint256 _tokenId, bytes memory _signature)
    public
    payable
    returns (bool success)
  {
    address sender = _msgSender();
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];

    if (drop.amountCap != 0) {
      require(drop.minted.current() < drop.amountCap, 'CR');
    }

    require(
      block.timestamp > drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );
    uint256 timeSpent = block.timestamp - drop.timeStart;
    uint256 duration = drop.timeEnd - drop.timeStart;
    uint256 price = getPriceFor(
      timeSpent,
      duration,
      drop.priceStart,
      drop.priceEnd,
      drop.stepDuration
    );
    require(msg.value >= price, 'IA');
    uint256 amountOnCyber = (msg.value * drop.shareCyber) / 100;
    uint256 amountCreator = msg.value - amountOnCyber;

    uint256 senderDropNonce = drop.mintCounter[sender].current();
    bytes memory _message = abi.encodePacked(_tokenId, sender, senderDropNonce);
    address recoveredAddress = keccak256(_message)
      .toEthSignedMessageHash()
      .recover(_signature);
    require(recoveredAddress == LibAppStorage.layout().manager, 'NM');

    // Effects
    drop.minted.increment();
    drop.mintCounter[sender].increment();
    _safeMint(sender, _tokenId, 1, '');
    drop.creator.transfer(amountCreator);
    payable(LibAppStorage.layout().oncyber).transfer(amountOnCyber);

    emit Minted(sender, _tokenId, 1);

    return true;
  }

  // function to mint many editions at once.
  function batchMint(
    string memory _uri,
    uint256 _amount,
    bytes memory _signature
  ) public returns (uint256 tokenId) {
    require(_amount > 0, 'IA');

    address sender = _msgSender();
    uint256 nonce = minterNonce(sender);
    bytes memory _message = abi.encodePacked(_uri, sender, _amount, nonce);
    address recoveredAddress = keccak256(_message)
      .toEthSignedMessageHash()
      .recover(_signature);
    require(recoveredAddress == LibAppStorage.layout().manager, 'NM');

    tokenId = LibAppStorage.layout().totalSupply.current();

    // Effects
    setTokenURI(tokenId, _uri);

    _safeMint(sender, tokenId, _amount, '');

    emit Minted(sender, tokenId, _amount);

    return tokenId;
  }

  function getMintPriceForToken(uint256 _tokenId)
    public
    view
    returns (uint256 mintPrice)
  {
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];
    require(drop.priceStart != 0, 'DNE');

    if (drop.amountCap != 0) {
      require(drop.minted.current() < drop.amountCap, 'CR');
    }

    require(
      block.timestamp > drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );
    uint256 timeSpent = block.timestamp - drop.timeStart;
    uint256 duration = drop.timeEnd - drop.timeStart;

    return
      getPriceFor(
        timeSpent,
        duration,
        drop.priceStart,
        drop.priceEnd,
        drop.stepDuration
      );
  }

  function getPriceFor(
    uint256 _timeSpent,
    uint256 _duration,
    uint256 _priceStart,
    uint256 _priceEnd,
    uint256 _stepDuration
  ) public pure returns (uint256 price) {
    // https://www.desmos.com/calculator/oajpdvew5q
    // f\left(x\right)=\frac{s\ \cdot d\ +\ \operatorname{mod}\left(x,\ g\right)\ \cdot\ \left(s\ -\ l\right)\ -\ x\ \cdot\ \left(s\ -\ l\right)\ \ }{d}
    // (s * d + (x % g) * (s - l) - x * (s - l) / d
    return
      (_duration *
        _priceStart +
        (_timeSpent % _stepDuration) *
        (_priceStart - _priceEnd) -
        _timeSpent *
        (_priceStart - _priceEnd)) / _duration;
  }
}
