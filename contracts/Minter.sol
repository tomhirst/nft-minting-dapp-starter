// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

/**
 * @title Minter contract
 * @dev Extends ERC721Enumerable Non-Fungible Token Standard
 */
contract Minter is ERC721Enumerable {
    using SafeMath for uint256;

    // Contract global variables.
    uint256 public constant mintPrice = 30000000000000000; // 0.03 ETH.
    uint256 public constant maxMint = 10;
    uint256 public MAX_TOKENS = 10000;

    // Name token using inherited ERC721 constructor.
    constructor() ERC721("Minter", "MINTER") {}

    // The main token minting function (recieves Ether).
    function mint(uint256 numberOfTokens) public payable {
        // Number of tokens can't be 0.
        require(numberOfTokens != 0, "You need to mint at least 1 token");
        // Check that the number of tokens requested doesn't exceed the max. allowed.
        require(numberOfTokens <= maxMint, "You can only mint 10 tokens at a time");
        // Check that the number of tokens requested wouldn't exceed what's left.
        require(totalSupply().add(numberOfTokens) <= MAX_TOKENS, "Minting would exceed max. supply");
        // Check that the right amount of Ether was sent.
        require(mintPrice.mul(numberOfTokens) <= msg.value, "Not enough Ether sent.");

        // For each token requested, mint one.
        for(uint256 i = 0; i < numberOfTokens; i++) {
            uint256 mintIndex = totalSupply();
            if(mintIndex < MAX_TOKENS) {
                /** 
                 * Mint token using inherited ERC721 function
                 * msg.sender is the wallet address of mint requester
                 * mintIndex is used for the tokenId (must be unique)
                 */
                _safeMint(msg.sender, mintIndex);
            }
        }
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}