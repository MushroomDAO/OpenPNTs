// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {OpenPNTs} from "../src/OpenPNTs.sol";
import {SaleFactory} from "../src/SaleFactory.sol";

/**
 * @title DeployOpenPNTs
 * @dev Deploys the core OpenPNTs and SaleFactory contracts.
 */
contract DeployOpenPNTs is Script {
    function run() external returns (OpenPNTs, SaleFactory) {
        // The address that will own the contracts.
        // In a real deployment, this would be a secure multisig or hardware wallet.
        address initialOwner = msg.sender;

        // The base URI for the PNT metadata.
        // This should point to the API server that will serve the JSON metadata.
        string memory baseURI = "http://localhost:3000/metadata/";

        vm.startBroadcast(initialOwner);

        // Deploy the main OpenPNTs contract
        OpenPNTs pnts = new OpenPNTs(baseURI, initialOwner);

        // Deploy the SaleFactory, linking it to the OpenPNTs contract
        SaleFactory factory = new SaleFactory(address(pnts), initialOwner);

        vm.stopBroadcast();

        return (pnts, factory);
    }
}
