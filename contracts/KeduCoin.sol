// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

/// @custom:security-contact security@voiceoftheeast.com
/**
 * @author  Kedu Blockchain Dev Lab.
 * @title   Kedu Coin.
 * @dev     Report Any Vulnerabilities to security@voiceoftheeast.com.
 * @notice  The Global Crypto Currency Powering the KEDU Ecosystem.
 */
contract KeduCoin is ERC20, ERC20Capped, ERC20Burnable, AccessControl, ERC20Permit, ERC20Votes {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public constant MAX_SUPPLY = 1000000000000 * 1e18; // 1 trillion with 18 decimals
    uint256 public constant AIRDROP_ALLOCATION = 150000000000 * 10**18; // 15% of total supply
    uint256 public constant FAIR_LAUNCH_ALLOCATION = 300000000000 * 10**18; // 30% of total supply
    uint256 public constant SOUTH_ESAT_DEVELOPMENT_FUND_ALLOCATION = 200000000000 * 10**18; // 20% of total supply vested over 10 years

    constructor(address kedufoundation, address southeastdevfundlock, address minter)
        ERC20("Kedu Coin", "KEDU")
        ERC20Permit("Kedu Coin")
        ERC20Capped(MAX_SUPPLY)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, kedufoundation);
        _grantRole(MINTER_ROLE, minter);

        _mint(msg.sender, FAIR_LAUNCH_ALLOCATION); // Mint tokens for fair launch to contract deployer
        _mint(kedufoundation, AIRDROP_ALLOCATION); // Mint tokens for airdrop to the Foundation address
        _mint(southeastdevfundlock, SOUTH_ESAT_DEVELOPMENT_FUND_ALLOCATION); //Mint tokens for South East Development Fund to the Vesting Lock Wallet.
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= cap(), "Cap Exceeded");
        _mint(to, amount);
    }

    function clock() public view override returns (uint48) {
        return uint48(block.timestamp);
    }

    // solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() public pure override returns (string memory) {
        return "mode=timestamp";
    }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Capped, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}
