// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

//import 'hardhat/console.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

import '../CyberDestinationFactoryBase.sol';

contract CyberDestinationFactoryFacet is CyberDestinationFactoryBase {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  function mint(
    string memory _uri,
    uint256 _amount,
    uint256 _amountOncyber,
    bytes memory _signature
  ) public returns (uint256 _tokenId) {
    address sender = _msgSender();
    uint256 nonce = minterNonce(sender);

    bytes memory _message = abi.encodePacked(
      _uri,
      _amount,
      _amountOncyber,
      nonce,
      sender
    );
    address recoveredAddress = keccak256(_message)
      .toEthSignedMessageHash()
      .recover(_signature);
    require(recoveredAddress == LibAppStorage.layout().manager, 'NM');
    require(_amount >= _amountOncyber, 'IAO');

    // Mint token
    _tokenId = LibAppStorage.layout().totalSupply.current();
    setTokenURI(_tokenId, _uri);
    LibAppStorage.layout().totalSupply.increment();
    LibAppStorage.layout().minterNonce[sender].increment();
    _safeMint(sender, _tokenId, _amount, '');

    if (_amountOncyber > 0) {
      _safeTransfer(
        sender,
        sender,
        LibAppStorage.layout().oncyber,
        _tokenId,
        _amountOncyber,
        ''
      );
    }

    emit Minted(sender, _tokenId, _amount);

    if (!isApprovedForAll(sender, LibAppStorage.layout().opensea)) {
      setApprovalForAll(LibAppStorage.layout().opensea, true);
    }

    return _tokenId;
  }
}
