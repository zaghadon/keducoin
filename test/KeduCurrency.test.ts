import { expect } from "chai";
import { ethers } from "hardhat";
import { KeduCurrency, KeduCurrency__factory } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("KeduCurrency Comprehensive Tests", function () {
    let keduCurrency: KeduCurrency;
    let deployer: HardhatEthersSigner, keduFoundation: HardhatEthersSigner, southeastDevFundLock: HardhatEthersSigner, keduApp: HardhatEthersSigner, addr1: HardhatEthersSigner, addr2: HardhatEthersSigner;

    beforeEach(async function () {
        [deployer, keduFoundation, southeastDevFundLock, keduApp, addr1, addr2] = await ethers.getSigners();
        const KeduCurrencyFactory = (await ethers.getContractFactory("KeduCurrency")) as KeduCurrency__factory;
        keduCurrency = await KeduCurrencyFactory.deploy(keduFoundation.address, southeastDevFundLock.address, keduApp.address);
        await keduCurrency.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right deployer and roles", async function () {
            expect(await keduCurrency.hasRole(await keduCurrency.DEFAULT_ADMIN_ROLE(), deployer.address)).to.equal(true);
            expect(await keduCurrency.hasRole(await keduCurrency.DEFAULT_ADMIN_ROLE(), keduFoundation.address)).to.equal(true);
            expect(await keduCurrency.hasRole(await keduCurrency.SYSTEM_ROLE(), keduApp.address)).to.equal(true);
        });

        it("Should assign the initial token allocations", async function () {
            const FAIR_LAUNCH_ALLOCATION = ethers.parseEther("300000000");
            const AIRDROP_ALLOCATION = ethers.parseEther("150000000");
            const SOUTH_ESAT_DEVELOPMENT_FUND_ALLOCATION = ethers.parseEther("200000000");

            expect(await keduCurrency.balanceOf(deployer.address)).to.equal(FAIR_LAUNCH_ALLOCATION);
            expect(await keduCurrency.balanceOf(keduFoundation.address)).to.equal(AIRDROP_ALLOCATION);
            expect(await keduCurrency.balanceOf(southeastDevFundLock.address)).to.equal(SOUTH_ESAT_DEVELOPMENT_FUND_ALLOCATION);
        });
    });

    describe("Points to Currency Conversions by SYSTEM_ROLE", function () {
        it("Should allow SYSTEM_ROLE to convert Points to tokens", async function () {
          const mintAmount = ethers.parseEther("1000");
          await expect(keduCurrency.connect(keduApp).convertKeduAppPointsToKEDU(addr1.address, mintAmount))
            .to.emit(keduCurrency, "KeduPointsConvertedToKEDU")
            .withArgs(addr1.address, mintAmount);
          expect(await keduCurrency.balanceOf(addr1.address)).to.equal(mintAmount);
        });
    
        it("Should not allow non-SYSTEM_ROLE to Convert Points to Token", async function () {
          const mintAmount = ethers.parseEther("1000");
          await expect(keduCurrency.connect(addr1).convertKeduAppPointsToKEDU(addr1.address, mintAmount)).to.be.reverted;
        });
    
        it("Should allow SYSTEM_ROLE to Convert tokens to Points", async function () {
          const burnAmount = ethers.parseEther("1000");
          await keduCurrency.connect(deployer).transfer(addr1.address, burnAmount);
          await expect(keduCurrency.connect(keduApp).convertKEDUToKeduAppPoints([addr1.address], [burnAmount]))
            .to.emit(keduCurrency, "KEDUConvertedToKeduPoints")
            .withArgs(addr1.address, burnAmount);
          expect(await keduCurrency.balanceOf(addr1.address)).to.equal(0);
        });
    
        it("Should reduce total supply after converting tokens to Points", async function () {
          const initialTotalSupply = await keduCurrency.totalSupply();
          const burnAmount = ethers.parseEther("1000");
          await keduCurrency.connect(deployer).transfer(addr1.address, burnAmount);
          await keduCurrency.connect(keduApp).convertKEDUToKeduAppPoints([addr1.address], [burnAmount]);
          const finalTotalSupply = await keduCurrency.totalSupply();
          expect(finalTotalSupply).to.equal(initialTotalSupply - burnAmount);
        });
    
        it("Should not allow non-SYSTEM_ROLE to convert tokens to Points", async function () {
          const burnAmount = ethers.parseEther("1000");
          await keduCurrency.connect(deployer).transfer(addr1.address, burnAmount);
          await expect(keduCurrency.connect(addr1).convertKEDUToKeduAppPoints([addr1.address], [burnAmount])).to.be.reverted;
        });
      });
    

    describe("Minting", function () {
        it("Should allow keduApp to mint tokens", async function () {
            const mintAmount = ethers.parseEther("1000");
            await keduCurrency.connect(keduApp).convertKeduAppPointsToKEDU(addr1.address, mintAmount);
            expect(await keduCurrency.balanceOf(addr1.address)).to.equal(mintAmount);
        });

        it("Should not allow non-keduApp to mint tokens", async function () {
            const mintAmount = ethers.parseEther("1000");
            await expect(keduCurrency.connect(addr1).convertKeduAppPointsToKEDU(addr1.address, mintAmount)).to.be.reverted;
        });
    });

    describe("Burning", function () {
        it("Should burn tokens correctly", async function () {
            const burnAmount = ethers.parseEther("1000");
            await keduCurrency.connect(deployer).burn(burnAmount);
            expect(await keduCurrency.balanceOf(deployer.address)).to.equal(ethers.parseEther("299999000"));
        });

        it("Should reduce total supply after burning tokens", async function () {
            const initialTotalSupply = await keduCurrency.totalSupply();
            const burnAmount = ethers.parseEther("1000");
            await keduCurrency.connect(deployer).burn(burnAmount);
            const finalTotalSupply = await keduCurrency.totalSupply();
            console.log(initialTotalSupply, "--->>>" , finalTotalSupply);
            expect(finalTotalSupply).to.equal(initialTotalSupply - burnAmount);
          });
    });

    describe("Transfers", function () {
        it("Should transfer tokens between accounts", async function () {
            const transferAmount = ethers.parseEther("1000");
            await keduCurrency.connect(deployer).transfer(addr1.address, transferAmount);
            expect(await keduCurrency.balanceOf(deployer.address)).to.equal(ethers.parseEther("299999000"));
            expect(await keduCurrency.balanceOf(addr1.address)).to.equal(transferAmount);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialdeployerBalance = await keduCurrency.balanceOf(deployer.address);
            await expect(keduCurrency.connect(addr1).transfer(deployer.address, 1)).to.be.reverted;
            expect(await keduCurrency.balanceOf(deployer.address)).to.equal(initialdeployerBalance);
        });
    });

    describe("Clock and Voting", function () {
        it("Should return the correct clock timestamp", async function () {
            const blockNumber = await ethers.provider.getBlockNumber();
            const currentBlock = await ethers.provider.getBlock(blockNumber);
            const currentBlockTimestamp = currentBlock?.timestamp;

            if (currentBlockTimestamp === undefined) {
                throw new Error("Current block timestamp is undefined");
            }

            expect(await keduCurrency.clock()).to.equal(currentBlockTimestamp);
        });

        it("Should return the correct clock mode", async function () {
            expect(await keduCurrency.CLOCK_MODE()).to.equal("mode=timestamp");
        });

        it("Should handle voting power correctly", async function () {
            const transferAmount = ethers.parseEther("1000");
            await keduCurrency.connect(deployer).transfer(addr1.address, transferAmount);
      
            // Checkpoints
            expect(await keduCurrency.getPastVotes(addr1.address, 0)).to.equal(0);
            await keduCurrency.connect(addr1).delegate(addr1.address);
            expect(await keduCurrency.getVotes(addr1.address)).to.equal(transferAmount);
          });
    });
});
