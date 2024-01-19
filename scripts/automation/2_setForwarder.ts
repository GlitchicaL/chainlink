import { ethers } from "hardhat";

/**
 * @notice Sets the forwarder. That is, the account
 * expected to perform the upkeep. Make sure to
 * register the upkeep and get the forwarder
 * address before calling this script.
 */

async function main() {
  const VAULT_ADDRESS = '0x39b5d580ACa2c7636Aa7C80684AF3C642f2f77D7';
  const FORWARDER_ADDRESS = '0x959C9B64b6C55c404559Bf62E2B9b678c83debc8';
  const [owner] = await ethers.getSigners();

  const vault = ethers.getContractAt('Vault', VAULT_ADDRESS, owner);

  (await ((await vault).setForwarder(FORWARDER_ADDRESS))).wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
