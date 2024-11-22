// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract Game is VRFConsumerBaseV2Plus {
    uint256 private constant ROLL_IN_PROGRESS = 42;
    uint256 public s_requestId;

    uint256 s_subscriptionId;
    address vrfCoordinator;
    bytes32 s_keyHash =
        0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;
    uint32 callbackGasLimit = 40000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;

    mapping(uint256 => address) private s_rollers;
    mapping(address => uint256) private s_results;

    event DiceRolled(uint256 indexed requestId, address indexed roller);
    event DiceLanded(uint256 indexed requestId, uint256 indexed result);

    constructor(
        uint256 _subscriptionId,
        address _vrfCoordinator
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        s_subscriptionId = _subscriptionId;
        vrfCoordinator = _vrfCoordinator;
    }

    function rollDice(
        address roller
    ) public onlyOwner returns (uint256 requestId) {
        require(s_results[roller] == 0, "Already rolled");

        requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: s_keyHash,
                subId: s_subscriptionId,
                requestConfirmations: requestConfirmations,
                callbackGasLimit: callbackGasLimit,
                numWords: numWords,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                )
            })
        );

        s_requestId = requestId;
        s_rollers[requestId] = roller;
        s_results[roller] = ROLL_IN_PROGRESS;
        emit DiceRolled(requestId, roller);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) internal override {
        // Convert the result to a number between 1 and 6
        uint256 value = (randomWords[0] % 6) + 1;

        // Assign the value to the address in the s_results mapping variable
        s_results[s_rollers[requestId]] = value;

        // emitting event to signal that dice landed
        emit DiceLanded(requestId, value);
    }

    function getResults(
        uint256 requestId
    ) external view returns (uint256 result) {
        return s_results[s_rollers[requestId]];
    }
}
