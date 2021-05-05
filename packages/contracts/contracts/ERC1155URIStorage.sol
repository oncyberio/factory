// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

abstract contract ERC1155URIStorage is ERC1155 {

  mapping (uint256 => string) private _tokenURIs;

  function uri(uint256 _tokenId) public view virtual override returns (string memory) {

    string memory tokenURI = _tokenURIs[_tokenId];
    require(bytes(tokenURI).length != 0, "ERC1155URIStorage: tokenId not exist");
    return string(abi.encodePacked(super.uri(0), tokenURI));

  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    _tokenURIs[tokenId] = _tokenURI;
  }

}
