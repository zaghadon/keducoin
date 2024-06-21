// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @custom:security-contact security@voiceoftheeast.com
/**
 * @author  Kedu Blockchain Dev Lab.
 * @title   KEDU CURRENCY Airdrop Distributor Contract.
 * @dev     Report Any Vulnerabilities to security@voiceoftheeast.com.
 * @notice  The KEDU CURRENCY Airdrop Distributor Contract for the KEDU Ecosystem.
 */

contract KeduAirdropDistributor is Ownable {
    IERC20 public keducoin;
    address private kedufoundation;
    address[] public recipients;
    mapping(address => uint256) public airdropAmounts;
    mapping(address => bool) public claimed;

    event AirdropSet(address indexed recipient, uint256 amount);
    event TokensClaimed(address indexed recipient, uint256 amount);
    event TokensBurned(uint256 amount);

    constructor(IERC20 _token, address _kedufoundation) Ownable(_kedufoundation) {
        keducoin = _token;
        kedufoundation = _kedufoundation;
    }

    function setAirdrop(address[] calldata _recipients, uint256[] calldata amounts) external onlyOwner {
        require(_recipients.length == amounts.length, "KeduAirdropDistributor: recipients and amounts length mismatch");
        
        for (uint256 i = 0; i < _recipients.length; i++) {
            airdropAmounts[_recipients[i]] = amounts[i];
            recipients.push(_recipients[i]);
            emit AirdropSet(_recipients[i], amounts[i]);
        }
    }

    function claimTokens() external {
        require(!claimed[msg.sender], "KeduAirdropDistributor: Tokens already claimed");
        require(airdropAmounts[msg.sender] > 0, "KeduAirdropDistributor: No tokens to claim");

        uint256 amount = airdropAmounts[msg.sender];
        claimed[msg.sender] = true;
        require(keducoin.transferFrom(kedufoundation, msg.sender, amount), "KeduAirdropDistributor: Transfer failed");

        emit TokensClaimed(msg.sender, amount);
    }

    function burnUnclaimedTokens() external onlyOwner {
        uint256 unclaimedAmount = 0;

        for (uint256 i = 0; i < recipients.length; i++) {
            address recipient = recipients[i];
            if (!claimed[recipient]) {
                unclaimedAmount += airdropAmounts[recipient];
                airdropAmounts[recipient] = 0;  // Reset the airdrop amount to prevent double counting
            }
        }

        ERC20Burnable burnableToken = ERC20Burnable(address(keducoin));
        burnableToken.burn(unclaimedAmount);

        emit TokensBurned(unclaimedAmount);
    }

    function getRecipients() external view returns (address[] memory) {
        return recipients;
    }
}
