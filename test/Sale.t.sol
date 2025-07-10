// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {OpenPNTs} from "../src/OpenPNTs.sol";
import {Sale} from "../src/Sale.sol";
import {SaleFactory} from "../src/SaleFactory.sol";
import {MockERC20} from "./mocks/MockERC20.sol";

contract SaleTest is Test {
    // Contracts
    OpenPNTs public pnts;
    SaleFactory public factory;
    MockERC20 public currency;

    // Users
    address public owner = address(0x1);
    address public alice = address(0x2); // Business Owner / Beneficiary
    address public bob = address(0x3); // Customer

    // Sale Parameters
    uint256 public pntTokenId = 0;
    uint256 public price = 1 * 1e18; // 1 currency unit per point
    uint256 public maxPoints = 10000;
    uint256 public minPoints = 500;

    function setUp() public {
        // Deploy core contracts
        vm.prank(owner);
        pnts = new OpenPNTs("https://api.openpnts.com/pnts/", owner);

        vm.prank(owner);
        factory = new SaleFactory(address(pnts), owner);

        // Deploy mock currency and deal funds to bob
        currency = new MockERC20("Mock USDC", "mUSDC", 18);
        currency.mint(bob, 100000 * 1e18);

        // Alice creates her PNT
        vm.prank(owner);
        pnts.create(alice, maxPoints);
    }

    function test_Factory_CreateSale() public {
        vm.prank(owner);
        address saleAddress = factory.createSale(
            pntTokenId,
            address(currency),
            price,
            maxPoints,
            minPoints,
            block.timestamp + 100,
            block.timestamp + 200,
            payable(alice)
        );
        assertTrue(saleAddress != address(0));
        assertEq(factory.deployedSales(0), saleAddress);
    }

    function test_Lifecycle_SuccessfulSale() public {
        // 1. Create Sale
        vm.prank(owner);
        address saleAddress = factory.createSale(
            pntTokenId, address(currency), price, maxPoints, minPoints,
            block.timestamp + 100, block.timestamp + 200, payable(alice)
        );
        Sale sale = Sale(saleAddress);

        // 2. Purchase enough points to succeed
        uint256 purchaseAmount = 600;
        uint256 cost = purchaseAmount * price;
        vm.startPrank(bob);
        currency.approve(saleAddress, cost);
        vm.warp(block.timestamp + 101); // Move time to after sale start
        sale.purchase(purchaseAmount);
        vm.stopPrank();

        assertEq(sale.totalPointsSold(), purchaseAmount);

        // 3. Finalize Sale
        vm.warp(block.timestamp + 201); // Move time to after sale end
        sale.finalize();
        assertEq(uint(sale.saleState()), uint(Sale.State.Successful));

        // 4. Beneficiary (Alice) provides PNTs to the sale contract for claiming
        vm.startPrank(alice);
        pnts.setApprovalForAll(saleAddress, true);
        pnts.safeTransferFrom(alice, saleAddress, pntTokenId, purchaseAmount, "");
        vm.stopPrank();

        // 5. Customer (Bob) claims PNTs
        vm.prank(bob);
        sale.claim();
        assertEq(pnts.balanceOf(bob, pntTokenId), purchaseAmount);

        // 6. Beneficiary (Alice) withdraws funds
        uint256 initialAliceBalance = currency.balanceOf(alice);
        vm.prank(alice);
        sale.withdraw();
        assertEq(currency.balanceOf(alice), initialAliceBalance + cost);
    }

    function test_Lifecycle_FailedSale() public {
        // 1. Create Sale
        vm.prank(owner);
        address saleAddress = factory.createSale(
            pntTokenId, address(currency), price, maxPoints, minPoints,
            block.timestamp + 100, block.timestamp + 200, payable(alice)
        );
        Sale sale = Sale(saleAddress);

        // 2. Purchase less than the minimum goal
        uint256 purchaseAmount = 100;
        uint256 cost = purchaseAmount * price;
        vm.startPrank(bob);
        currency.approve(saleAddress, cost);
        vm.warp(block.timestamp + 101);
        sale.purchase(purchaseAmount);
        vm.stopPrank();

        // 3. Finalize Sale
        vm.warp(block.timestamp + 201);
        sale.finalize();
        assertEq(uint(sale.saleState()), uint(Sale.State.Failed));

        // 4. Customer (Bob) gets a refund
        uint256 initialBobBalance = currency.balanceOf(bob);
        vm.prank(bob);
        sale.refund();
        assertEq(currency.balanceOf(bob), initialBobBalance + cost);
    }
}
