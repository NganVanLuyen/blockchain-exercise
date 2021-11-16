// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract E20TK is ERC20 {
    constructor() ERC20("E20TK", "E20") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount * (10**decimals()));
    }
}
