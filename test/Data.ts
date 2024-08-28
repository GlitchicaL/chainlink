import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Data", function () {
  const PRICE_FEED_ADDRESS = "0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9";

  async function deployData() {
    const [owner] = await ethers.getSigners();

    const Data = await ethers.getContractFactory("Data");
    const data = await Data.deploy();

    return { data, owner };
  }

  describe("Deployment", function () {
    it("Should set the owner", async function () {
      const { data, owner } = await loadFixture(deployData);
      expect(await data.owner()).to.equal(owner.address);
    });

    it("Should set the threshold", async function () {
      const { data } = await loadFixture(deployData);
      expect(await data.getPriceFeedAddress()).to.equal(PRICE_FEED_ADDRESS);
    });
  });

  describe("Reading Price", function () {
    it("Should fetch the price", async function () {
      const { data } = await loadFixture(deployData);

      const price = await data.getLatestPrice();
      console.log(`Price: ${price}`);
      expect(price).to.be.greaterThan(0);
    });
  });
});
