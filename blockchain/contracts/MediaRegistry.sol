// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MediaRegistry
 * @notice Immutable proof-of-ownership for UniteX media uploads.
 *
 * Each record stores:
 *  - fileHash    : SHA-256 of the uploaded file (duplicate detection)
 *  - usercode    : The uploader's 4-character identifier (primary key in our system)
 *  - docId       : Firestore Document ID for cross-chain metadata lookup
 *  - timestamp   : Block timestamp of the record
 *
 * Gas optimized: uses mappings over arrays, minimal storage.
 */
contract MediaRegistry {
    // ─── Events ───────────────────────────────────────────────────────────────
    event MediaStored(
        string indexed fileHash,
        string usercode,
        string docId,
        uint256 timestamp
    );

    // ─── Storage ──────────────────────────────────────────────────────────────
    struct MediaRecord {
        string usercode;
        string docId;
        uint256 timestamp;
        bool exists;
    }

    // fileHash => MediaRecord (prevents duplicates on-chain)
    mapping(string => MediaRecord) public records;

    // usercode => all fileHashes uploaded by that user
    mapping(string => string[]) public userMediaIndex;

    // ─── Only authorized service can write ────────────────────────────────────
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Unauthorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // ─── Write ────────────────────────────────────────────────────────────────

    /**
     * @notice Store a new media record.
     * @param fileHash  SHA-256 hex string of the uploaded file
     * @param usercode  4-char alphanumeric owner identifier
     * @param docId     Firestore document ID
     */
    function storeRecord(
        string calldata fileHash,
        string calldata usercode,
        string calldata docId
    ) external onlyOwner {
        require(!records[fileHash].exists, "Duplicate: hash already registered");

        records[fileHash] = MediaRecord({
            usercode: usercode,
            docId: docId,
            timestamp: block.timestamp,
            exists: true
        });

        userMediaIndex[usercode].push(fileHash);

        emit MediaStored(fileHash, usercode, docId, block.timestamp);
    }

    // ─── Read ─────────────────────────────────────────────────────────────────

    /**
     * @notice Get all file hashes uploaded by a usercode.
     */
    function getUserMedia(string calldata usercode)
        external
        view
        returns (string[] memory)
    {
        return userMediaIndex[usercode];
    }

    /**
     * @notice Verify if a file hash is registered and get its owner.
     */
    function verifyRecord(string calldata fileHash)
        external
        view
        returns (bool exists, string memory usercode, uint256 timestamp)
    {
        MediaRecord memory r = records[fileHash];
        return (r.exists, r.usercode, r.timestamp);
    }
}
