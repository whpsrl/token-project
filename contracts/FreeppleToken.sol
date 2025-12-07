// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Freepple Token (FRP)
 * @dev Token ERC-20 standard con funzionalità burn
 * @notice Supply totale: 1,000,000,000 FRP
 */
contract FreeppleToken is ERC20, ERC20Burnable, Ownable {
    
    // Supply totale: 1 miliardo con 18 decimali
    uint256 public constant TOTAL_SUPPLY = 1_000_000_000 * 10**18;

    /**
     * @dev Crea il token e minta tutta la supply al deployer
     */
    constructor() ERC20("Freepple", "FRP") Ownable(msg.sender) {
        // Minta 1 miliardo di token al creatore del contratto
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    /**
     * @dev Restituisce il numero di decimali (18 è lo standard)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}




