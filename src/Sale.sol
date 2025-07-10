// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/IERC1155.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title Sale
 * @dev Manages the pre-sale of a specific EIP-1155 token.
 */
contract Sale {
    using SafeERC20 for IERC20;

    enum State {
        Pending, // The sale has been created but not yet started
        Active, // The sale is currently active
        Successful, // The sale ended and met the minimum goal
        Failed, // The sale ended and did not meet the minimum goal
        Closed // Funds have been withdrawn by the beneficiary or refunded to customers
    }

    // --- State Variables ---

    State public saleState;

    // --- Immutable Sale Parameters ---

    IERC1155 public immutable PNT_CONTRACT;
    uint256 public immutable TOKEN_ID;
    IERC20 public immutable CURRENCY;
    uint256 public immutable PRICE; // Price per single point in the smallest unit of CURRENCY
    uint256 public immutable MAX_POINTS_TO_SELL;
    uint256 public immutable MIN_POINTS_TO_SELL;
    uint256 public immutable SALE_START_TIME;
    uint256 public immutable SALE_END_TIME;
    address payable public immutable BENEFICIARY; // Business owner who receives proceeds

    // --- Mutable Sale Data ---

    uint256 public totalPointsSold;
    mapping(address => uint256) public pointsPurchased;

    // --- Events ---

    event PointsPurchased(address indexed customer, uint256 amount, uint256 cost);
    event SaleFinalized(State finalState);
    event PointsClaimed(address indexed customer, uint256 amount);
    event Refunded(address indexed customer, uint256 amount);
    event Withdrawn(address indexed beneficiary, uint256 amount);

    // --- Constructor ---

    constructor(
        address _pntContract,
        uint256 _tokenId,
        address _currency,
        uint256 _price,
        uint256 _maxPoints,
        uint256 _minPoints,
        uint256 _startTime,
        uint256 _endTime,
        address payable _beneficiary
    ) {
        require(_price > 0, "Price must be > 0");
        require(_maxPoints > 0, "Max points must be > 0");
        require(_startTime >= block.timestamp, "Start time must be in the future");
        require(_endTime > _startTime, "End time must be after start time");

        PNT_CONTRACT = IERC1155(_pntContract);
        TOKEN_ID = _tokenId;
        CURRENCY = IERC20(_currency);
        PRICE = _price;
        MAX_POINTS_TO_SELL = _maxPoints;
        MIN_POINTS_TO_SELL = _minPoints;
        SALE_START_TIME = _startTime;
        SALE_END_TIME = _endTime;
        BENEFICIARY = _beneficiary;

        saleState = State.Pending;
    }

    // --- External Functions ---

    /**
     * @dev Allows a customer to purchase loyalty points.
     */
    function purchase(uint256 amount) external {
        if (block.timestamp >= SALE_START_TIME && saleState == State.Pending) {
            saleState = State.Active;
        }
        require(saleState == State.Active, "Sale is not active");
        require(block.timestamp <= SALE_END_TIME, "Sale has ended");
        require(amount > 0, "Amount must be > 0");
        require(totalPointsSold + amount <= MAX_POINTS_TO_SELL, "Not enough points left");

        uint256 cost = amount * PRICE;
        totalPointsSold += amount;
        pointsPurchased[msg.sender] += amount;

        CURRENCY.safeTransferFrom(msg.sender, address(this), cost);

        emit PointsPurchased(msg.sender, amount, cost);
    }

    /**
     * @dev Finalizes the sale after the end time.
     * Anyone can call this to transition the state.
     */
    function finalize() external {
        require(block.timestamp > SALE_END_TIME, "Sale has not ended yet");
        require(saleState == State.Active || saleState == State.Pending, "Sale already finalized");

        if (totalPointsSold >= MIN_POINTS_TO_SELL) {
            saleState = State.Successful;
        } else {
            saleState = State.Failed;
        }

        // The beneficiary must transfer the PNTs to this contract for claiming.
        // This is a manual step for the MVP.

        emit SaleFinalized(saleState);
    }

    /**
     * @dev Allows the beneficiary to withdraw the proceeds of a successful sale.
     */
    function withdraw() external {
        require(saleState == State.Successful, "Sale was not successful");
        require(msg.sender == BENEFICIARY, "Only beneficiary can withdraw");

        uint256 balance = CURRENCY.balanceOf(address(this));
        CURRENCY.safeTransfer(BENEFICIARY, balance);

        emit Withdrawn(BENEFICIARY, balance);
    }

    /**
     * @dev Allows customers to claim their purchased points from a successful sale.
     */
    function claim() external {
        require(saleState == State.Successful, "Sale was not successful");
        uint256 amountToClaim = pointsPurchased[msg.sender];
        require(amountToClaim > 0, "No points to claim");

        pointsPurchased[msg.sender] = 0;
        PNT_CONTRACT.safeTransferFrom(address(this), msg.sender, TOKEN_ID, amountToClaim, "");

        emit PointsClaimed(msg.sender, amountToClaim);
    }

    /**
     * @dev Allows customers to get a refund from a failed sale.
     */
    function refund() external {
        require(saleState == State.Failed, "Sale was not failed");
        uint256 amountToRefund = pointsPurchased[msg.sender];
        require(amountToRefund > 0, "No points to refund");

        pointsPurchased[msg.sender] = 0;
        uint256 cost = amountToRefund * PRICE;

        CURRENCY.safeTransfer(msg.sender, cost);

        emit Refunded(msg.sender, cost);
    }

    // --- ERC1155 Receiver Hooks ---

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4) {
        // This contract is designed to receive ERC1155 tokens (PNTs) from the beneficiary
        // for distribution to customers. It does not need to react to the transfer
        // in any special way, just acknowledge receipt.
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4) {
        // This contract is not expected to receive batch transfers of ERC1155 tokens.
        // However, implementing this function is required by the interface.
        return this.onERC1155BatchReceived.selector;
    }

    // Required for ERC1155 compatibility
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return interfaceId == 0x4e2312e0; // ERC1155Receiver interface ID
    }
}
