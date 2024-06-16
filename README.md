# KEDU Smart Contracts for Decentralized Rewards and Governance.

This project consists of the Kedu Coin SmartContract, The Airdrop Distributor Contract, and the South Development Fund Vesting Wallet Contract, all of which are Contracts utilizing the OpenZepplin SmartContracts Library and HardHat Development Tooling.

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
