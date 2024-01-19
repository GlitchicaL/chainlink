import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Vault", function () {
  async function deployVault() {
    const [owner] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("Vault");
    const vault = await Vault.deploy();

    return { vault, owner };
  }

  describe("Deployment", function () {
    it("Should set the owner", async function () {
      const { vault, owner } = await loadFixture(deployVault);
      expect(await vault.owner()).to.equal(owner.address);
    });

    it("Should set the threshold", async function () {
      const { vault } = await loadFixture(deployVault);
      expect(await vault.threshold()).to.equal(ethers.parseUnits('0.10', 'ether'));
    });
  });

  describe("Sending & Withdrawing ERC20", function () {
    it("Sends ERC20", async function () {
      const { vault, owner } = await loadFixture(deployVault);

      const AMOUNT = ethers.parseUnits('0.10', 'ether');
      const ADDRESS = await vault.getAddress();

      // TODO: FILL ME IN!
    });

    it("Withdraws ERC20", async function () {
      const { vault, owner } = await loadFixture(deployVault);

      const AMOUNT = ethers.parseUnits('0.10', 'ether');
      const ADDRESS = await vault.getAddress();

      // TODO: FILL ME IN!
    });
  });

  describe("Sending & Withdrawing ETH", function () {
    it("Sends ETH", async function () {
      const { vault, owner } = await loadFixture(deployVault);

      const AMOUNT = ethers.parseUnits('0.10', 'ether');
      const ADDRESS = await vault.getAddress();

      await owner.sendTransaction({
        to: ADDRESS,
        value: AMOUNT
      });

      expect(await ethers.provider.getBalance(ADDRESS)).to.equal(AMOUNT);
    });

    it("Withdraws ETH", async function () {
      const { vault, owner } = await loadFixture(deployVault);

      const AMOUNT = ethers.parseUnits('0.10', 'ether');
      const ADDRESS = await vault.getAddress();

      await owner.sendTransaction({
        to: ADDRESS,
        value: AMOUNT
      });

      await (await vault.connect(owner).withdrawETH()).wait();
      expect(await ethers.provider.getBalance(ADDRESS)).to.equal(0);
    });
  });
});
