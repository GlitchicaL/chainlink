import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Game", function () {
  async function deployGame() {
    const [owner, roller] = await ethers.getSigners();

    const VRFCoordinatorV2_5Mock = await ethers.getContractFactory("VRFCoordinatorV2_5Mock");
    const vrfCoordinatorV2_5Mock = await VRFCoordinatorV2_5Mock.deploy(100000000000000000n, 1000000000n, 4480501292011196n);

    await (await vrfCoordinatorV2_5Mock.connect(owner).createSubscription()).wait(1);

    const filter = vrfCoordinatorV2_5Mock.filters.SubscriptionCreated;
    const events = await vrfCoordinatorV2_5Mock.queryFilter(filter, -1);

    // The first event and the first arg is the subscription
    const subscriptionId = events[0].args[0];

    await (await vrfCoordinatorV2_5Mock.connect(owner).fundSubscription(subscriptionId, 100000000000000000000n)).wait();

    const Game = await ethers.getContractFactory("Game");
    const game = await Game.deploy(subscriptionId, await vrfCoordinatorV2_5Mock.getAddress());

    await (await vrfCoordinatorV2_5Mock.connect(owner).addConsumer(subscriptionId, await game.getAddress())).wait();

    return { game, vrfCoordinatorV2_5Mock, owner, roller };
  }

  describe("Deployment", function () {
    // TODO: FILL ME IN!
  });

  describe("Rolling Dice", function () {
    it("Sends ERC20", async function () {
      const { game, vrfCoordinatorV2_5Mock, owner, roller } = await loadFixture(deployGame);

      await (await game.connect(owner).rollDice(roller.address)).wait();

      const requestId = await game.s_requestId();

      await (await vrfCoordinatorV2_5Mock.connect(owner).fulfillRandomWords(requestId, await game.getAddress())).wait();

      const result = await game.getResults(requestId);

      expect(result).to.be.lessThan(7);
      expect(result).to.be.greaterThan(0);
    });
  });
});
