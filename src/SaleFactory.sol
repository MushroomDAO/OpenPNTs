// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Sale} from "./Sale.sol";

/**
 * @title SaleFactory
 * @dev Deploys new Sale contracts for businesses.
 */
contract SaleFactory is Ownable {
    address public immutable PNT_CONTRACT;
    address[] public deployedSales;

    event SaleCreated(
        address indexed saleAddress,
        address indexed beneficiary,
        uint256 indexed tokenId
    );

    constructor(address _pntContract, address initialOwner) Ownable(initialOwner) {
        PNT_CONTRACT = _pntContract;
    }

    /**
     * @dev Creates a new Sale contract for a specific PNT.
     * @param _tokenId The ID of the token being sold.
     * @param _currency The ERC20 token used for payment.
     * @param _price The price per single loyalty point.
     * @param _maxPoints The maximum number of points to sell.
     * @param _minPoints The minimum number of points for the sale to be successful.
     * @param _startTime The start time of the sale.
     * @param _endTime The end time of the sale.
     * @param _beneficiary The business owner who will receive the proceeds.
     * @return saleAddress The address of the newly created Sale contract.
     */
    function createSale(
        uint256 _tokenId,
        address _currency,
        uint256 _price,
        uint256 _maxPoints,
        uint256 _minPoints,
        uint256 _startTime,
        uint256 _endTime,
        address payable _beneficiary
    ) external onlyOwner returns (address) {
        Sale newSale = new Sale(
            PNT_CONTRACT,
            _tokenId,
            _currency,
            _price,
            _maxPoints,
            _minPoints,
            _startTime,
            _endTime,
            _beneficiary
        );

        address saleAddress = address(newSale);
        deployedSales.push(saleAddress);

        emit SaleCreated(saleAddress, _beneficiary, _tokenId);

        return saleAddress;
    }
}
