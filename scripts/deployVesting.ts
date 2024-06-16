import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("SouthEastDevFundLock");

  const requiredAddresses = [
    'SEDF_BENEFICIARY',
  ];
  
  requiredAddresses.forEach(addressVar => {
    if (!process.env[addressVar]) {
      throw new Error(`Environment variable '${addressVar}' not found.`);
    }
  });

  const sedfbeneficiary = process.env.SEDF_BENEFICIARY as string;
  const start = Math.floor(Date.now() / 1000); // current time in seconds
  const duration = 10 * 365 * 24 * 60 * 60; // 10 years in seconds

  const instance = await ContractFactory.deploy(sedfbeneficiary, start, duration);
  await instance.waitForDeployment();

  console.log(`Contract deployed to ${await instance.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
