// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

//import "hardhat/console.sol";
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '../CyberDestinationFactoryBase.sol';
import '../libraries/LibAppStorage.sol';
import './LibUtilityStorage.sol';

contract CyberDestinationUtilityFactoryFacet is CyberDestinationFactoryBase {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  function getDrop(uint256 _tokenId)
    public
    view
    returns (LibUtilityStorage.Drop memory)
  {
    LibUtilityStorage.Drop memory drop = LibUtilityStorage.layout().drops[
      _tokenId
    ];
    require(drop.timeStart != 0, 'DNE');

    return drop;
  }

  function mint(
    string memory _uri,
    uint256 _timeStart,
    uint256 _timeEnd,
    uint256 _price,
    uint256 _amountCap,
    uint256 _shareOncyber,
    bytes memory _signature
  ) public returns (uint256 _tokenId) {
    address sender = _msgSender();
    uint256 nonce = minterNonce(sender);
    require(_shareOncyber <= 100, 'ISO');
    require(_timeStart < _timeEnd, 'IT');

    bytes memory _message = abi.encodePacked(
      _uri,
      _timeStart,
      _timeEnd,
      _price,
      _amountCap,
      _shareOncyber,
      nonce,
      sender
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
    LibUtilityStorage.Drop memory drop = LibUtilityStorage.Drop({
      timeStart: _timeStart,
      timeEnd: _timeEnd,
      amountCap: _amountCap,
      shareOncyber: _shareOncyber,
      creator: payable(sender),
      price: _price,
      minted: 0
    });
    LibUtilityStorage.layout().drops[_tokenId] = drop;

    return _tokenId;
  }

  function mintEdition(uint256 _tokenId) public payable returns (bool) {
    address sender = _msgSender();
    LibUtilityStorage.Drop storage drop = LibUtilityStorage.layout().drops[
      _tokenId
    ];
    require(
      block.timestamp >= drop.timeStart && block.timestamp <= drop.timeEnd,
      'OOT'
    );
    require(msg.value == drop.price, 'IA');
    if (drop.amountCap != 0) {
      require(drop.minted < drop.amountCap, 'CR');
    }
    drop.minted += 1;
    _safeMint(sender, _tokenId, 1, '');
    emit Minted(sender, _tokenId, 1);

    uint256 amountOnCyber = (msg.value * drop.shareOncyber) / 100;
    uint256 amountCreator = msg.value - amountOnCyber;

    drop.creator.transfer(amountCreator);
    payable(LibAppStorage.layout().oncyber).transfer(amountOnCyber);
    return true;
  }
}
