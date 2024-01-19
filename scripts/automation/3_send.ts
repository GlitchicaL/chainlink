import { ethers } from "hardhat";

/**
 * @notice This is meant to send ETH to the 
 * Vault contract. Once the ETH balance in the
 * Vault is higher than 0.1 ETH, it should
 * trigger the upkeep.
 */

async function main() {
  const [owner] = await ethers.getSigners();

  await owner.sendTransaction({
    to: '0x39b5d580ACa2c7636Aa7C80684AF3C642f2f77D7',
    value: ethers.parseUnits('0.15', 'ether'),
    gasLimit: 100000
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
