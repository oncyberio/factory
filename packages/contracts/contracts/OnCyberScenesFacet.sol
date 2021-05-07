// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./ERC1155URIStorage.sol";
import "./libraries/LibAppStorage.sol";
import "./BaseRelayRecipient.sol";
import "./diamond/LibDiamond.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract OnCyberScenesFacet is BaseRelayRecipient, ERC1155URIStorage {

  using ECDSA for bytes32;
  using Counters for Counters.Counter;

  event Minted(address indexed account, uint256 indexed tokenId, uint256 indexed amount);

  function _msgSender() internal override(BaseRelayRecipient, Context) view returns (address) {

    return BaseRelayRecipient._msgSender();

  }

  function initialize(string memory _uri, address _manager, address _trustedForwarder, address _opensea) public {

    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    require(ds.contractOwner == msg.sender, "NO");

    ds.supportedInterfaces[type(IERC1155).interfaceId] = true;
    _setURI(_uri);
    s.manager = _manager;
    s.trustedForwarder = _trustedForwarder;
    s.opensea = _opensea;

  }

  function totalSupply() public view returns (uint256) {

    return s.totalSupply.current();

  }

  function manager() public view returns (address) {

    return s.manager;

  }

  function minterNonce(address _minter) public view returns (uint256){

    return s.minterNonce[_minter].current();

  }

  function mint(string memory _uri, uint256 _amount, bytes memory _signature) public returns (uint256 _tokenId) {

    address sender = _msgSender();
    uint256 nonce = minterNonce(sender);

    bytes memory _message = abi.encodePacked(_uri, _amount, nonce, sender);
    address _recoveredAddress = keccak256(_message).toEthSignedMessageHash().recover(_signature);
    require(_recoveredAddress == s.manager, "NM");

    // Mint token
    _tokenId = s.totalSupply.current();
    _setTokenURI(_tokenId, _uri);
    s.totalSupply.increment();
    s.minterNonce[sender].increment();
    _mint(sender, _tokenId, _amount, "");

    emit Minted(sender, _tokenId, _amount);

    if(!isApprovedForAll(sender, s.opensea) ){

      setApprovalForAll(s.opensea, true);

    }

    return _tokenId;

  }

}
