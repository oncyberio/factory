// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

//import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import './libraries/LibAppStorage.sol';
import './libraries/LibDropStorage.sol';
import './CyberDestinationFactoryBase.sol';

contract CyberDropBase is CyberDestinationFactoryBase {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  event DestinationMinted(address indexed account, uint256 indexed tokenId);

  function getDrop(uint256 _tokenId)
    public
    view
    returns (LibDropStorage.Drop memory)
  {
    LibDropStorage.Drop memory drop = LibDropStorage.layout().drops[_tokenId];
    require(drop.timeStart != 0, 'DNE');

    return drop;
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
    require(_priceStart >= _priceEnd, 'IP');
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

    // Mint token
    _tokenId = LibAppStorage.layout().totalSupply.current();
    setTokenURI(_tokenId, _uri);
    LibAppStorage.layout().totalSupply.increment();
    LibAppStorage.layout().minterNonce[sender].increment();
    LibDropStorage.Drop memory drop = LibDropStorage.Drop({
      timeStart: _timeStart,
      timeEnd: _timeEnd,
      priceStart: _priceStart,
      priceEnd: _priceEnd,
      stepDuration: _stepDuration,
      amountCap: _amountCap,
      shareCyber: _shareCyber,
      creator: payable(sender),
      minted: 0
    });
    LibDropStorage.layout().drops[_tokenId] = drop;

    emit DestinationMinted(sender, _tokenId);

    return _tokenId;
  }

  function mint(uint256 _tokenId) public payable returns (bool) {
    address sender = _msgSender();
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];

    require(
      block.timestamp > drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );

    if (drop.amountCap != 0) {
      require(drop.minted < drop.amountCap, 'CR');
    }

    uint256 price = getMintPriceForDrop(drop);
    require(msg.value >= price, 'IA');

    _safeMint(sender, _tokenId, 1, '');
    drop.minted += 1;
    emit Minted(sender, _tokenId, 1);

    uint256 amountOnCyber = (msg.value * drop.shareCyber) / 100;
    uint256 amountCreator = msg.value - amountOnCyber;

    drop.creator.transfer(amountCreator);
    payable(LibAppStorage.layout().oncyber).transfer(amountOnCyber);
    return true;
  }

  function getMintPriceForToken(uint256 _tokenId)
    public
    view
    returns (uint256)
  {
    LibDropStorage.Drop storage drop = LibDropStorage.layout().drops[_tokenId];

    require(
      block.timestamp > drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );
    if (drop.amountCap != 0) {
      require(drop.minted < drop.amountCap, 'CR');
    }
    return getMintPriceForDrop(drop);
  }

  function getMintPriceForDrop(LibDropStorage.Drop memory drop)
    public
    view
    returns (uint256)
  {
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
