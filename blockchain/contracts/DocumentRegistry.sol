// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title DocumentRegistry
 * @author LexiChain BFSI Platform
 * @notice This smart contract provides on-chain proof-of-deposit for BFSI
 *         contract documents. It stores SHA-256 hashes of documents along
 *         with their registration timestamp, making submission dates
 *         provable, tamper-proof, and legally opposable.
 *
 * @dev How it works:
 *      1. The platform computes a SHA-256 hash of the uploaded PDF
 *      2. The hash is registered on the blockchain via registerDocument()
 *      3. The block.timestamp at the time of mining becomes the proof date
 *      4. Anyone can verify a document's existence via verifyDocument()
 *
 *      No actual document content is stored on-chain — only the hash.
 *      This preserves privacy while providing cryptographic proof.
 */
contract DocumentRegistry {
    // ═══════════════════════════════════════════════════
    // DATA STRUCTURES
    // ═══════════════════════════════════════════════════

    /**
     * @notice Represents a registered document's on-chain record
     * @param timestamp When the document was registered (block.timestamp)
     * @param depositor The address that registered the document
     * @param exists Whether this record is valid
     */
    struct DocumentRecord {
        uint256 timestamp;
        address depositor;
        bool exists;
    }

    // ═══════════════════════════════════════════════════
    // STATE VARIABLES
    // ═══════════════════════════════════════════════════

    /// @notice Maps document hash → registration record
    mapping(bytes32 => DocumentRecord) private documents;

    /// @notice Maps depositor address → list of document hashes they registered
    mapping(address => bytes32[]) private depositorDocuments;

    /// @notice Total number of documents registered
    uint256 public totalDocuments;

    /// @notice Contract owner (the platform backend wallet)
    address public owner;

    // ═══════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════

    /**
     * @notice Emitted when a new document is registered on-chain
     * @param docHash The SHA-256 hash of the document
     * @param timestamp The block timestamp at registration
     * @param depositor The address that registered the document
     */
    event DocumentRegistered(
        bytes32 indexed docHash,
        uint256 timestamp,
        address indexed depositor
    );

    /**
     * @notice Emitted when a document is verified
     * @param docHash The document hash that was checked
     * @param exists Whether the document was found on-chain
     * @param verifier The address that performed the verification
     */
    event DocumentVerified(
        bytes32 indexed docHash,
        bool exists,
        address indexed verifier
    );

    // ═══════════════════════════════════════════════════
    // MODIFIERS
    // ═══════════════════════════════════════════════════

    /// @notice Restricts function to contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // ═══════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════

    constructor() {
        owner = msg.sender;
    }

    // ═══════════════════════════════════════════════════
    // CORE FUNCTIONS
    // ═══════════════════════════════════════════════════

    /**
     * @notice Register a document hash on the blockchain
     * @dev Creates an immutable record with the current block timestamp.
     *      Reverts if the same hash was already registered (no duplicates).
     * @param _docHash The SHA-256 hash of the document (bytes32)
     */
    function registerDocument(
        bytes32 _docHash
    ) external onlyOwner {
        // Prevent duplicate registrations
        require(
            !documents[_docHash].exists,
            "Document already registered on-chain"
        );

        // Store the document record
        documents[_docHash] = DocumentRecord({
            timestamp: block.timestamp,
            depositor: msg.sender,
            exists: true
        });

        // Track documents per depositor
        depositorDocuments[msg.sender].push(_docHash);

        // Increment counter
        totalDocuments++;

        // Emit event for off-chain indexing
        emit DocumentRegistered(
            _docHash,
            block.timestamp,
            msg.sender
        );
    }

    /**
     * @notice Verify if a document exists on-chain and get its details
     * @param _docHash The SHA-256 hash of the document to verify
     * @return exists Whether the document is registered
     * @return timestamp When it was registered (0 if not found)
     * @return depositor Who registered it (address(0) if not found)
     */
    function verifyDocument(
        bytes32 _docHash
    )
        external
        view
        returns (
            bool exists,
            uint256 timestamp,
            address depositor
        )
    {
        DocumentRecord memory record = documents[_docHash];
        return (
            record.exists,
            record.timestamp,
            record.depositor
        );
    }

    /**
     * @notice Get the timestamp for a specific document hash
     * @param _docHash The document hash to look up
     * @return The registration timestamp (0 if not registered)
     */
    function getTimestamp(bytes32 _docHash) external view returns (uint256) {
        return documents[_docHash].timestamp;
    }

    /**
     * @notice Get all document hashes registered by a specific address
     * @param _depositor The address to query
     * @return Array of document hashes
     */
    function getDocumentsByDepositor(
        address _depositor
    ) external view returns (bytes32[] memory) {
        return depositorDocuments[_depositor];
    }

    /**
     * @notice Get the number of documents registered by a specific address
     * @param _depositor The address to query
     * @return Number of documents
     */
    function getDocumentCount(
        address _depositor
    ) external view returns (uint256) {
        return depositorDocuments[_depositor].length;
    }

    /**
     * @notice Transfer ownership of the contract
     * @dev Only the current owner can transfer ownership
     * @param _newOwner The address of the new owner
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "New owner cannot be zero address");
        owner = _newOwner;
    }
}
