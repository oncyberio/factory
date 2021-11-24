// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

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

  function getMintedByDrop(uint256 _tokenId, address _minter)
    public
    view
    returns (uint256)
  {
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];
    require(drop.priceStart != 0, 'DNE');
    return drop.minterNonce[_minter].current();
  }

  function getDrop(uint256 _tokenId)
    public
    view
    returns (
      uint256 _timeStart,
      uint256 _timeEnd,
      uint256 _priceStart,
      uint256 _priceEnd,
      uint256 _stepDuration,
      uint256 _amountCap,
      uint256 _shareCyber,
      address _creator,
      uint256 _minted
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
      drop.minted
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
  ) public returns (uint256 _tokenId) {
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
    _tokenId = LibAppStorage.layout().totalSupply.current();

    // Effects
    setTokenURI(_tokenId, _uri);
    LibAppStorage.layout().totalSupply.increment();
    LibAppStorage.layout().minterNonce[sender].increment();

    LibDropStorage.layout().drops[_tokenId].timeStart = _timeStart;
    LibDropStorage.layout().drops[_tokenId].timeEnd = _timeEnd;
    LibDropStorage.layout().drops[_tokenId].priceStart = _priceStart;
    LibDropStorage.layout().drops[_tokenId].priceEnd = _priceEnd;
    LibDropStorage.layout().drops[_tokenId].stepDuration = _stepDuration;
    LibDropStorage.layout().drops[_tokenId].amountCap = _amountCap;
    LibDropStorage.layout().drops[_tokenId].shareCyber = _shareCyber;
    LibDropStorage.layout().drops[_tokenId].creator = payable(sender);

    emit DropCreated(sender, _tokenId);

    return _tokenId;
  }

  function mint(uint256 _tokenId, bytes memory _signature) public payable returns (bool) {
    address sender = _msgSender();
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];

    require(
      block.timestamp > drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );

    if (drop.amountCap != 0) {
      require(drop.minted < drop.amountCap, 'CR');
    }
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

    uint256 senderDropNonce = drop.minterNonce[sender].current();
    bytes memory _message = abi.encodePacked(_tokenId, sender, senderDropNonce);
    address recoveredAddress = keccak256(_message)
      .toEthSignedMessageHash()
      .recover(_signature);
    require(recoveredAddress == LibAppStorage.layout().manager, 'NM');

    // Effects
    drop.minted += 1;
    drop.minterNonce[sender].increment();
    _safeMint(sender, _tokenId, 1, '');
    drop.creator.transfer(amountCreator);
    payable(LibAppStorage.layout().oncyber).transfer(amountOnCyber);

    emit Minted(sender, _tokenId, 1);

    return true;
  }

  function getMintPriceForToken(uint256 _tokenId)
    public
    view
    returns (uint256)
  {
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];
    require(drop.priceStart != 0, 'DNE');

    require(
      block.timestamp > drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );
    if (drop.amountCap != 0) {
      require(drop.minted < drop.amountCap, 'CR');
    }
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
  ) public pure returns (uint256) {
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
