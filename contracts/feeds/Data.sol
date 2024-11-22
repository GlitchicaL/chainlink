// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Data {
    AggregatorV3Interface internal dataFeed =
        AggregatorV3Interface(0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9);

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Getter function to retrieve the price feed address
    function getPriceFeedAddress() public view returns (address) {
        return address(dataFeed);
    }

    // Get latest price
    function getLatestPrice() public view returns (int256) {
        (, int256 price, , , ) = dataFeed.latestRoundData(); // Fetch latest price data from Chainlink
        return price; // Return price
    }
}
