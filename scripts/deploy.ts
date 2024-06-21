import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("KeduCurrency");

  const requiredAddresses = [
    'KEDU_FOUNDATION_ADDRESS',
    'SEDF_VESTING_WALLET',
    'MINTER_ADDRESS',
  ];
  
  requiredAddresses.forEach(addressVar => {
    if (!process.env[addressVar]) {
      throw new Error(`Environment variable '${addressVar}' not found.`);
    }
  });

  const kedufoundation = process.env.KEDU_FOUNDATION_ADDRESS as string;
  const minter = process.env.MINTER_ADDRESS as string;
  const southeastdevfundlock = process.env.SEDF_VESTING_WALLET as string;

  const instance = await ContractFactory.deploy(kedufoundation, southeastdevfundlock, minter);
  await instance.waitForDeployment();

  console.log(`Contract deployed to ${await instance.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
