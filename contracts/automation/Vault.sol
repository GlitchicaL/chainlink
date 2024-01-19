// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AutomationBase, AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

/**
 * @title Vault
 * @author Justin 'GlitchicaL'
 * @dev Simple contract that stores ETH and sends a small amount of ETH based on the
 * interval set. This is used as an example for ChainLink Automation. You can see
 * documentation here:
 * - https://docs.chain.link/chainlink-automation/guides/compatible-contracts
 */

contract Vault is AutomationCompatibleInterface {
    uint256 public threshold = 0.10 ether;
    address public forwarder;
    address public owner;

    modifier onlyForwarder() {
        msg.sender == forwarder;
        _;
    }

    modifier onlyOwner() {
        msg.sender == owner;
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    /**
     * @notice Check if this contract balance is greater than threshold.
     * @return upkeepNeeded True or false if condition is met.
     * @return memory performData.
     */
    function checkUpkeep(
        bytes calldata
    ) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = address(this).balance > threshold;
    }

    /**
     * @notice Send funds to owner. Should only be called by forwarder.
     */
    function performUpkeep(bytes calldata) external override onlyForwarder {
        if (address(this).balance > threshold) {
            payable(owner).transfer(address(this).balance);
        }
    }

    // Access control function

    /**
     * @notice Set the forwarder address.
     * @param _forwarder Address of expected performUpkeep caller.
     * @dev The forwarder is used to prevent anyone from calling
     * performUpkeep. This is helpful for sensitive state changes
     * your performUpkeep may perform.
     *
     * @notice You get the forwarder address after registering
     * the upkeep.
     */
    function setForwarder(address _forwarder) external onlyOwner {
        forwarder = _forwarder;
    }

    /**
     * @notice Allow owner to withdraw tokens from this contract
     * @param _token Address of the ERC20
     */
    function withdrawToken(address _token) external onlyOwner {
        IERC20(_token).transfer(owner, IERC20(_token).balanceOf(address(this)));
    }

    /**
     * @notice Allow owner to withdraw ETH from this contract
     */
    function withdrawETH() external onlyOwner {
        owner.call{value: address(this).balance}("");
    }
}
