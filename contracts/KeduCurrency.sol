// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @custom:security-contact security@voiceoftheeast.com
/**
 * @author  Kedu Blockchain Dev Lab.
 * @title   KEDU CURRENCY.
 * @dev     Report Any Vulnerabilities to security@voiceoftheeast.com.
 * @notice  The Global Crypto Currency Powering the KEDU Ecosystem.
 */
contract KeduCurrency is
    ERC20,
    ERC20Burnable,
    AccessControl,
    ERC20Permit,
    ERC20Votes
{
    bytes32 public constant SYSTEM_ROLE = keccak256("SYSTEM_ROLE");

    //uint256 public constant TOTAL_SUPPLY = 1000000000 * 10**18; // 1 Billion KEDU

    uint256 public constant AIRDROP_ALLOCATION = 150000000 * 10 ** 18; // 15% of total supply
    uint256 public constant FAIR_LAUNCH_ALLOCATION = 300000000 * 10 ** 18; // 30% of total supply
    uint256 public constant SOUTH_ESAT_DEVELOPMENT_FUND_ALLOCATION = 200000000 * 10 ** 18; // 20% of total supply vested over 10 years

    event KEDUConvertedToKeduPoints(address indexed account, uint256 amount);
    event KeduPointsConvertedToKEDU(address indexed account, uint256 amount);

    constructor(
        address kedufoundation,
        address southeastdevfundlock,
        address keduapp
    ) ERC20("KEDU CURRENCY", "KEDU") ERC20Permit("KEDU CURRENCY") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, kedufoundation);
        _grantRole(SYSTEM_ROLE, keduapp);

        _mint(msg.sender, FAIR_LAUNCH_ALLOCATION); // Mint tokens for fair launch to contract deployer
        _mint(kedufoundation, AIRDROP_ALLOCATION); // Mint tokens for airdrop to the Foundation address
        _mint(southeastdevfundlock, SOUTH_ESAT_DEVELOPMENT_FUND_ALLOCATION); //Mint tokens for South East Development Fund to the Vesting Lock Wallet.
    }

    function convertKeduAppPointsToKEDU(
        address account,
        uint256 amount
    ) public onlyRole(SYSTEM_ROLE) {
        _mint(account, amount);
        emit KeduPointsConvertedToKEDU(account, amount);
    }

    function convertKEDUToKeduAppPoints(
        address[] calldata accounts,
        uint256[] calldata amounts
    ) public onlyRole(SYSTEM_ROLE) {
        require(
            accounts.length == amounts.length,
            "Array lengths must be equal"
        );

        for (uint256 i = 0; i < accounts.length; i++) {
            _burn(accounts[i], amounts[i]);
            emit KEDUConvertedToKeduPoints(accounts[i], amounts[i]);
        }
    }

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }

    function nonces(
        address owner
    ) public view override(ERC20Permit, Nonces) returns (uint256) {
        return super.nonces(owner);
    }
}
