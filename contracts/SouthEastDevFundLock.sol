// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/finance/VestingWallet.sol";

/// @custom:security-contact security@voiceoftheeast.com
/**
 * @author  Kedu Blockchain Dev Lab.
 * @title   South East Developement Fund.
 * @dev     Report Any Vulnerabilities to security@voiceoftheeast.com.
 * @notice  The Vesting Wallet for South East Development Fund. To Lock The Tokens for 10 years Gradual Release.
 */

contract SouthEastDevFundLock is VestingWallet {
        uint64 public constant VESTING_START = 1717023600; //Thursday May 30 2024 00:00:00 GMT+0100 (West Africa Standard Time) BIAFRA DAY
        uint64 public constant VESTING_DURATION = 315360000; // 10 years in seconds (315360000)
        
    constructor(
        address beneficiaryAddress //SEDF MAIN DONATION WALLET
    ) VestingWallet(beneficiaryAddress, VESTING_START, VESTING_DURATION) {}
}
