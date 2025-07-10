// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

/**
 * @title OpenPNTs
 * @dev Central EIP-1155 contract for managing multiple loyalty point tokens.
 */
contract OpenPNTs is ERC1155, Ownable {
    // Counter to keep track of the next available token ID
    uint256 public nextTokenId;

    // Mapping from a token ID to the business owner who created it
    mapping(uint256 => address) public tokenCreator;

    /**
     * @dev Sets the base URI for metadata and transfers ownership.
     * The base URI can be a gateway like https://api.openpnts.com/meta/{id}.json
     * The {id} placeholder is replaced by the actual token ID in lowercase hex.
     */
    constructor(
        string memory baseURI,
        address initialOwner
    ) ERC1155(baseURI) Ownable(initialOwner) {}

    /**
     * @dev Creates a new type of loyalty point for a business.
     * Only the owner of this contract (the platform) can call this.
     * @param creator The business owner's address (e.g., Alice's address).
     * @param initialSupply The number of points to mint for the business owner.
     * @return tokenId The ID of the newly created loyalty point type.
     */
    function create(
        address creator,
        uint256 initialSupply
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        tokenCreator[tokenId] = creator;

        // Mint the initial supply to the business owner.
        // EIP-1155 does not have decimals, so we mint the exact amount.
        _mint(creator, tokenId, initialSupply, "");

        return tokenId;
    }

    /**
     * @dev Overrides the default URI function to support the {id} placeholder.
     */
    function uri(
        uint256 tokenId
    ) public view override returns (string memory) {
        return super.uri(tokenId);
    }

    /**
     * @dev Allows the owner to update the base URI for metadata.
     */
    function setURI(string memory newURI) public onlyOwner {
        _setURI(newURI);
    }
}
