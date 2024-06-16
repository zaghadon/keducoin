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
    constructor(
        address beneficiaryAddress,
        uint64 startTimestamp,
        uint64 durationSeconds
    ) VestingWallet(beneficiaryAddress, startTimestamp, durationSeconds) {}
}
