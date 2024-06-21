# KEDU Smart Contracts for Decentralized Rewards and Governance.

This project consists of the KEDU CURRENCY SmartContract, The Airdrop Distributor Contract, and the South Development Fund Vesting Wallet Contract, all of which are Contracts utilizing the OpenZepplin SmartContracts Library and HardHat Development Tooling.

## Installing dependencies

```
npm install
```

## Testing the contract

```
npm test
```

## Deploying the contracts

You can target any network from your Hardhat config using:

```
npx hardhat run --network <network-name> scripts/deploy.ts
```

Deploy The Vesting Wallet:

```
npx hardhat run --network <network-name> scripts/deployVesting.ts
```

Deploy The Airdrop Distributor Contract:

```
npx hardhat run --network <network-name> scripts/deployAirdrop.ts
```

## Verifying Deployment Code on Etherscan

Verifying Contracts Using HardHart Verify Package generally follows below CLI Command pattern (Note - Replace Constructor Arguments with relevant addresses or constructor params):

```
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```

Sample Verifying the KeduCurrency Contract on Sepolia

```
npx hardhat verify --network base-sepolia 0x97C2c46E944a4c639A4b97C2C76dF9947E131C45 "0x4e28a1142B85fb06406bd89b194EBCD5d320DBe3" "0x6810143E2daBA5bBA01bCCd0438e7EE75ED4D389" "0xec58bF231eF83772B46094F8dDf9576f59612507"
```

Sample Verifying the Vesting Wallet Contract on Sepolia

```
npx hardhat verify --network base-sepolia --contract contracts/SouthEastDevFundLock.sol:SouthEastDevFundLock 0x6810143E2daBA5bBA01bCCd0438e7EE75ED4D389 "0xc12223697f82348b297B1A29eBCAd7534252C54B"
```