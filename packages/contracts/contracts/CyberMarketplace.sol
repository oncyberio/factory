// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Address.sol';
//import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/utils/introspection/ERC165Checker.sol';
import '@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol';

bytes4 constant NFT_SIG = 0xd9b67a26;

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
    uint256 id,
    address nftContract,
    uint256 tokenId,
    address seller,
    uint256 price,
    uint256 endTime
  );

  event Buy(
    uint256 id,
    address nftContract,
    uint256 tokenId,
    address seller,
    address buyer,
    uint256 price
  );

  Counters.Counter private listingsId;

  mapping(uint256 => Listing) private listings;

  function sell(
    address nftContract,
    uint256 tokenId,
    uint256 price,
    uint256 duration
  ) public {
    // pre
    require(
      ERC165Checker.supportsInterface(nftContract, NFT_SIG),
      'Invalid NFT'
    );
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

    listings[id] = Listing(
      id,
      nftContract,
      payable(msg.sender),
      tokenId,
      price,
      block.timestamp + duration
    );

    IERC1155(nftContract).safeTransferFrom(
      msg.sender,
      address(this),
      tokenId,
      1,
      '0x0'
    );

    emit Sell(
      id,
      nftContract,
      tokenId,
      msg.sender,
      price,
      block.timestamp + duration
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
