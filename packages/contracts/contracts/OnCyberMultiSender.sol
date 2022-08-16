// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;
import '@solidstate/contracts/token/ERC1155/IERC1155.sol';

//import 'hardhat/console.sol';

contract OnCyberMultiSender {
  function transfer(
    IERC1155 _token,
    uint256 id,
    address[] calldata _receivers,
    uint256[] calldata _quantities
  ) external {
    require(_receivers.length == _quantities.length, 'OnCyberMultiSender: receivers and quantities length mismatch');
    for (uint256 i = 0; i < _receivers.length; i++) {
      _token.safeTransferFrom(msg.sender, _receivers[i], id, _quantities[i], '');
    }
  }
}
