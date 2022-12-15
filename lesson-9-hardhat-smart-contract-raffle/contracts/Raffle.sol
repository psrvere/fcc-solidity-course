// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle__NotEnoughEth();
error Raffle__OnlyOwner();
error Raffle__TransferFailed();
error Raffle__LotteryNotOpen();
error Raffle__UpkeepNotNeeded(uint256 contractBalance, uint256 numParticipants, uint256 raffleState);

/** @title Sample Raffle contract
 *  @author PSR
 *  @notice This contract will accept funds from participants and declare a random winner at predfefined interval
 *  @dev This implements Chainlink VRF v2 and Keeprs
 */
contract Raffle is VRFConsumerBaseV2, KeeperCompatibleInterface {
  // Type Declarations
  enum RaffleState {
    OPEN,
    CALCULATING
  }

  // Storage Variables
  address payable[] private s_participants;
  uint32 private s_callbackGasLimit;
  // Lottery Variables
  address private s_recentWinner;
  RaffleState private s_raffleState;
  uint256 private s_lastTimeStamp;

  // Immutable Variables
  VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
  address private immutable i_owner;
  uint256 private immutable i_entranceFee;
  bytes32 private immutable i_gasLane;
  uint64 private immutable i_subscriptionId;
  uint256 private immutable i_interval;

  // Constants
  uint16 private constant MINIMUM_REQUEST_CONFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;

  // Events
  event RaffleEntered(address indexed participant);
  event RandomWordRequested(uint256 indexed requestId);
  event WinnerPicked(address indexed winner);

  // Functions
  constructor(
    address _vrfCoordinatorV2,
    uint256 _entranceFee,
    bytes32 _gasLane,
    uint64 _subscriptionId,
    uint32 _callbackGasLimit,
    uint256 _interval
  ) VRFConsumerBaseV2(_vrfCoordinatorV2) {
    i_owner = msg.sender;
    i_entranceFee = _entranceFee;
    i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinatorV2);
    i_gasLane = _gasLane;
    i_subscriptionId = _subscriptionId;
    s_callbackGasLimit = _callbackGasLimit;
    s_raffleState = RaffleState.OPEN;
    s_lastTimeStamp = block.timestamp;
    i_interval = _interval;
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) {
      revert Raffle__OnlyOwner();
    }
    _;
  }

  function enterRaffle() public payable {
    if (msg.value < i_entranceFee) {
      revert Raffle__NotEnoughEth();
    }
    if (s_raffleState != RaffleState.OPEN) {
      revert Raffle__LotteryNotOpen();
    }
    s_participants.push(payable(msg.sender));
    emit RaffleEntered(msg.sender);
  }

  /**
   * Four things are needed for upkeepNeeded to return true:
   * 1. Raffle time interval should be over
   * 2. There should be at least 1 participant and non zero ETH in the contract
   * 3. Subscription is funded with LINK token
   * 4. Lottery should be in an "open" state
   */
  function checkUpkeep(
    bytes memory /*checkData*/
  ) public view override returns (bool upkeepNeeded, bytes memory /*performData*/) {
    bool isOpen = (RaffleState.OPEN == s_raffleState);
    bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
    bool hasParticipants = (s_participants.length > 0);
    bool hasBalance = address(this).balance > 0;
    upkeepNeeded = isOpen && timePassed && hasParticipants && hasBalance;
    return (upkeepNeeded, "0x0");
  }

  // request random number and do something with it
  function performUpkeep(bytes calldata /*performData*/) external override {
    (bool upkeepNeeded, ) = checkUpkeep("");
    if (!upkeepNeeded) {
      revert Raffle__UpkeepNotNeeded(address(this).balance, s_participants.length, uint256(s_raffleState));
    }
    s_raffleState = RaffleState.CALCULATING;
    uint256 requestId = i_vrfCoordinator.requestRandomWords(
      i_gasLane,
      i_subscriptionId,
      MINIMUM_REQUEST_CONFIRMATIONS,
      s_callbackGasLimit,
      NUM_WORDS
    );
    emit RandomWordRequested(requestId);
  }

  function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override {
    uint256 winnerIndex = randomWords[0] % s_participants.length;
    address payable recentWinnerAddress = s_participants[winnerIndex];
    s_recentWinner = recentWinnerAddress;
    s_raffleState = RaffleState.OPEN;
    s_participants = new address payable[](0);
    s_lastTimeStamp = block.timestamp;
    (bool success, ) = recentWinnerAddress.call{value: address(this).balance}("");
    if (!success) revert Raffle__TransferFailed();
    emit WinnerPicked(recentWinnerAddress);
  }

  function setCallBackGasLimit(uint32 _callbackGasLimit) public onlyOwner {
    s_callbackGasLimit = _callbackGasLimit;
  }

  // View/Pure Functions
  function getEntranceFee() public view returns (uint256) {
    return i_entranceFee;
  }

  function getParticipant(uint256 _index) public view returns (address) {
    return s_participants[_index];
  }

  function getCallBackGasLimit() public view returns (uint32) {
    return s_callbackGasLimit;
  }

  function getRecentWinner() public view returns (address) {
    return s_recentWinner;
  }

  function getRaffleState() public view returns (RaffleState) {
    return s_raffleState;
  }

  function getNumWords() public pure returns (uint256) {
    return NUM_WORDS;
  }

  function getNumberOfParticipants() public view returns (uint256) {
    return s_participants.length;
  }

  function getLatestTimestamp() public view returns (uint256) {
    return s_lastTimeStamp;
  }

  function getRequestConfirmations() public pure returns (uint256) {
    return MINIMUM_REQUEST_CONFIRMATIONS;
  }
}
