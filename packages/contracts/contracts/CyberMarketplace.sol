// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Address.sol';
//import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165Checker.sol';
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

contract CyberMarketplace is ERC1155Holder {
  using Counters for Counters.Counter;

  struct Listing {
    uint256 id;
    address nftContract;
    address payable seller;
    uint256 tokenId;
    uint256 price;
    uint256 endTime;
  }

  event Sell(
    uint256 indexed id,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    uint256 price,
    uint256 endTime
  );

  event Buy(
    uint256 indexed id,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address buyer,
    uint256 price
  );

  address[] private whitelistedContracts;

  Counters.Counter private listingsId;

  mapping(uint256 => Listing) public listings;

  function isValidNFT(address nftContract) public view returns (bool) {
    return ERC165Checker.supportsInterface(nftContract, type(IERC1155).interfaceId);
  }


  function init(address[] calldata _whitelist) public {
    for(uint i = 0; i < _whitelist.length; i++) {
      address nftContract = _whitelist[i];
      require(isValidNFT(nftContract), 'Invalid NFT');
      whitelistedContracts.push(_whitelist[i]);
    }
  }

  function isWhitelisted(address nftContract) public view returns (bool) {
    for(uint i = 0; i < whitelistedContracts.length; i++) {
      if(nftContract == whitelistedContracts[i]) return true;
    }
    return false;
  }

  function whitelist(address nftContract) public {
    require(isValidNFT(nftContract), 'Invalid NFT');
    if(!isWhitelisted(nftContract)) {
      whitelistedContracts.push(nftContract);
    }
  }

  function sell(
    address nftContract,
    uint256 tokenId,
    uint256 price,
    uint256 duration
  ) public {
    // pre
    require(isWhitelisted(nftContract), "Not whitelisted");
    require(
      IERC1155(nftContract).balanceOf(msg.sender, tokenId) > 0,
      'Empty balance'
    );
    require(
      IERC1155(nftContract).isApprovedForAll(msg.sender, address(this)),
      'Not approved'
    );

    listingsId.increment();
    uint256 id = listingsId.current();
    uint256 endTime = block.timestamp + duration;

    listings[id] = Listing(
      id,
      nftContract,
      payable(msg.sender),
      tokenId,
      price,
      endTime
    );

    IERC1155(nftContract).safeTransferFrom(
      msg.sender,
      address(this),
      tokenId,
      1,
      ''
    );

    emit Sell(
      id,
      nftContract,
      tokenId,
      msg.sender,
      price,
      endTime
    );
  }

  function buy(uint256 listingId) public payable {
    Listing memory listing = listings[listingId];
    // pre
    require(listing.id > 0, 'Invalid listing id');
    require(block.timestamp < listing.endTime, 'Listing expired');
    require(msg.value == listing.price, 'Invalid price');

    delete listings[listingId];

    listing.seller.transfer(msg.value);

    IERC1155(listing.nftContract).safeTransferFrom(
      address(this),
      msg.sender,
      listing.tokenId,
      1,
      '0x0'
    );

    emit Buy(
      listingId,
      listing.nftContract,
      listing.tokenId,
      listing.seller,
      msg.sender,
      listing.price
    );
  }
}
