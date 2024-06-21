import { expect } from "chai";
import { ethers } from "hardhat";

describe("KeduCurrency Tests", function () {
  it("Test Contract Creation is Successful", async function () {
    const ContractFactory = await ethers.getContractFactory("KeduCurrency");

    const defaultAdmin = (await ethers.getSigners())[0].address;
    const minter = (await ethers.getSigners())[1].address;
    const southeastdevfundlock = (await ethers.getSigners())[2].address;

    const instance = await ContractFactory.deploy(defaultAdmin, southeastdevfundlock, minter);
    await instance.waitForDeployment();

    expect(await instance.name()).to.equal("KEDU CURRENCY");
  });

  it("Deployer can renounce DEFAULT_ADMIN_ROLE", async function () {
    const [deployer, defaultAdmin, minter, southeastdevfundlock] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("KeduCurrency", {signer: deployer});
    
    const instance = await ContractFactory.deploy(defaultAdmin.address, southeastdevfundlock.address, minter.address);
    await instance.waitForDeployment();

    const DEFAULT_ADMIN_ROLE = await instance.DEFAULT_ADMIN_ROLE();

    // Check that deployer has the DEFAULT_ADMIN_ROLE initially
    expect(await instance.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)).to.be.true;

    // Deployer renounces DEFAULT_ADMIN_ROLE
    await instance.connect(deployer).renounceRole(DEFAULT_ADMIN_ROLE, deployer.address);

    // Check that deployer no longer has the DEFAULT_ADMIN_ROLE
    expect(await instance.hasRole(DEFAULT_ADMIN_ROLE, deployer.address)).to.be.false;
  });

  it("Ensure Kedu Foundation provided as constructor prop has DEFAULT_ADMIN_ROLE", async function () {
    const [defaultAdmin, minter, southeastdevfundlock] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("KeduCurrency");
    
    const instance = await ContractFactory.deploy(defaultAdmin.address, southeastdevfundlock.address, minter.address);
    await instance.waitForDeployment();

    const DEFAULT_ADMIN_ROLE = await instance.DEFAULT_ADMIN_ROLE();

    // Check that defaultAdmin has the DEFAULT_ADMIN_ROLE initially
    expect(await instance.hasRole(DEFAULT_ADMIN_ROLE, defaultAdmin.address)).to.be.true;
  });
});
