// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console2} from "forge-std/Test.sol";
import {OpenPNTs} from "../src/OpenPNTs.sol";

/**
 * @title Test for OpenPNTs
 * @dev Tests the core functionality of the OpenPNTs contract.
 */
contract OpenPNTsTest is Test {
    OpenPNTs public pnts;
    address public owner = address(0x1);
    address public user1 = address(0x2);
    string public baseURI = "https://api.openpnts.com/pnts/";

    /**
     * @dev Sets up the test environment before each test case.
     */
    function setUp() public {
        // Deploy the contract with a specific owner
        vm.prank(owner);
        pnts = new OpenPNTs(baseURI, owner);
    }

    /**
     * @dev Tests the initial state of the contract after deployment.
     */
    function test_InitialState() public {
        assertEq(pnts.owner(), owner, "Owner should be set correctly");
        assertEq(pnts.nextTokenId(), 0, "Initial nextTokenId should be 0");
        assertEq(pnts.uri(0), baseURI, "Base URI should be set correctly");
    }

    /**
     * @dev Tests the successful creation of a new PNT type.
     */
    function test_CreatePNT() public {
        vm.prank(owner);
        uint256 tokenId = pnts.create(user1, 1000);

        assertEq(tokenId, 0, "First token ID should be 0");
        assertEq(pnts.nextTokenId(), 1, "nextTokenId should increment");
        assertEq(pnts.balanceOf(user1, tokenId), 1000, "Creator should receive initial supply");
        assertEq(pnts.tokenCreator(tokenId), user1, "Token creator should be recorded");
    }

    /**
     * @dev Tests that only the owner can create a new PNT type.
     */
    function test_Fail_CreatePNT_NotOwner() public {
        vm.prank(user1); // A non-owner tries to call
        vm.expectRevert(abi.encodeWithSelector(bytes4(keccak256("OwnableUnauthorizedAccount(address)")), user1));
        pnts.create(user1, 1000);
    }

    /**
     * @dev Tests that the owner can successfully update the base URI.
     */
    function test_SetURI() public {
        string memory newURI = "https://new.api.com/meta/";
        vm.prank(owner);
        pnts.setURI(newURI);
        assertEq(pnts.uri(0), newURI, "Base URI should be updatable");
    }

    /**
     * @dev Tests that a non-owner cannot update the base URI.
     */
    function test_Fail_SetURI_NotOwner() public {
        string memory newURI = "https://new.api.com/meta/";
        vm.prank(user1);
        vm.expectRevert(abi.encodeWithSelector(bytes4(keccak256("OwnableUnauthorizedAccount(address)")), user1));
        pnts.setURI(newURI);
    }
}
