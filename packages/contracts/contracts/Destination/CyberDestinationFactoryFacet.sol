// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "../CyberDestinationFactoryBase.sol";

contract CyberDestinationFactoryFacet is CyberDestinationFactoryBase {
  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  function mint(string memory _uri, uint256 _amount, uint256 _amount_oncyber, bytes memory _signature) public returns (uint256 _tokenId) {

    address sender = _msgSender();
    uint256 nonce = minterNonce(sender);

    bytes memory _message = abi.encodePacked(_uri, _amount, _amount_oncyber, nonce, sender);
    address _recoveredAddress = keccak256(_message).toEthSignedMessageHash().recover(_signature);
    require(_recoveredAddress == LibAppStorage.layout().manager, "NM");
    require(_amount >= _amount_oncyber, "IAO");

    // Mint token
    _tokenId = LibAppStorage.layout().totalSupply.current();
    setTokenURI(_tokenId, _uri);
    LibAppStorage.layout().totalSupply.increment();
    LibAppStorage.layout().minterNonce[sender].increment();
    _safeMint(sender, _tokenId, _amount, "");

    if(_amount_oncyber > 0){
      _safeTransfer(sender, sender, LibAppStorage.layout().oncyber, _tokenId, _amount_oncyber, "");
    }

    emit Minted(sender, _tokenId, _amount);

    if(!isApprovedForAll(sender, LibAppStorage.layout().opensea) ){

      setApprovalForAll(LibAppStorage.layout().opensea, true);

    }

    return _tokenId;

  }

}
