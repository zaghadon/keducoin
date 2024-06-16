import { ethers } from "hardhat";

async function main() {
  const ContractFactory = await ethers.getContractFactory("KeduAirdropDistributor");

  const requiredAddresses = [
    'KEDU_FOUNDATION_ADDRESS',
    'KEDU_COIN_CA'
  ];

  requiredAddresses.forEach(addressVar => {
    if (!process.env[addressVar]) {
      throw new Error(`Environment variable '${addressVar}' not found.`);
    }
  });

  const kedufoundation = process.env.KEDU_FOUNDATION_ADDRESS as string;
  const keducoinAddress = process.env.KEDU_COIN_CA as string;

  // Get the contract factory
  const KeduToken = await ethers.getContractFactory("KeduCoin");

  // Attach the contract address to the contract factory
  const keduToken = KeduToken.attach(keducoinAddress);

  const instance = await ContractFactory.deploy(kedufoundation, keduToken);
  await instance.waitForDeployment();

  console.log(`Contract deployed to ${await instance.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
