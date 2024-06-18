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
  //const start = 1717023600; //Thursday May 30 2024 00:00:00 GMT+0100 (West Africa Standard Time)
  //const duration = 10 * 365 * 24 * 60 * 60; // 10 years in seconds (315360000)

  const instance = await ContractFactory.deploy(sedfbeneficiary);
  await instance.waitForDeployment();

  console.log(`Contract deployed to ${await instance.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
