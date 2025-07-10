// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) {
        // The ERC20 constructor handles setting name and symbol.
        // Decimals are typically fixed at 18 for standard ERC20s, or can be overridden.
        // For a mock, we can just set it directly if needed, but ERC20 default is 18.
        // If we want custom decimals, we need to use a different constructor pattern or a custom ERC20.
        // For simplicity, let's assume 18 decimals for this mock.
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}