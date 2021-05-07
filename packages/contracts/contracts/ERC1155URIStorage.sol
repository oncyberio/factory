// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "./openzepplin/ERC1155.sol";
import "./libraries/LibAppStorage.sol";
import "./BaseFacet.sol";

abstract contract ERC1155URIStorage is BaseFacet, ERC1155 {

  function uri(uint256 _tokenId) public view virtual override returns (string memory) {

    string memory tokenURI = s._tokenURIs[_tokenId];
    require(bytes(tokenURI).length != 0, "ERC1155URIStorage: tokenId not exist");
    return string(abi.encodePacked(super.uri(0), tokenURI));

  }

  function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    s._tokenURIs[tokenId] = _tokenURI;
  }

}
