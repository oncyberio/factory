// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@solidstate/contracts/token/ERC1155/ERC1155.sol";
import "./ERC1155URIStorage.sol";

abstract contract ERC1155URI is ERC1155 {

  function uri(uint256 _tokenId) public view virtual returns (string memory) {

    string memory tokenURI = ERC1155URIStorage.layout().tokenURIs[_tokenId];
    require(bytes(tokenURI).length != 0, "ERC1155URI: tokenId not exist");
    return string(abi.encodePacked(ERC1155URIStorage.layout().uri, tokenURI));

  }

  function setURI(string memory new_uri) internal virtual {
    ERC1155URIStorage.layout().uri = new_uri;
  }

  function setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
    ERC1155URIStorage.layout().tokenURIs[tokenId] = _tokenURI;
  }

}
