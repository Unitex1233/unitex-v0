/**
 * Blockchain Service (Ethers.js)
 * ─────────────────────────────────────────────
 * Writes media hashes + owner usercode to a
 * deployed smart contract on a public EVM chain.
 *
 * Default: Polygon Amoy Testnet (free, fast, real)
 * Override via .env to use mainnet or Base.
 */

import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

// ABI for the MediaRegistry smart contract (see /blockchain/contracts/)
const CONTRACT_ABI = [
    "function storeRecord(string calldata fileHash, string calldata usercode, string calldata docId) external",
    "event MediaStored(string fileHash, string usercode, string docId, uint256 timestamp)"
];

let provider = null;
let signer = null;
let contract = null;

function getContract() {
    if (contract) return contract;

    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL;
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    const contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS;

    if (!rpcUrl || !privateKey || !contractAddress) {
        throw new Error('Blockchain env vars not set (BLOCKCHAIN_RPC_URL, BLOCKCHAIN_PRIVATE_KEY, BLOCKCHAIN_CONTRACT_ADDRESS)');
    }

    provider = new ethers.JsonRpcProvider(rpcUrl);
    signer = new ethers.Wallet(privateKey, provider);
    contract = new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
    return contract;
}

/**
 * Store a media record proof on-chain.
 * @param {object} params
 * @param {string} params.fileHash  - SHA-256 of the uploaded file
 * @param {string} params.usercode  - The uploader's unique 4-char code
 * @param {string} params.docId     - Firestore document ID for cross-reference
 * @returns {string} Transaction hash
 */
export async function storeMediaRecord({ fileHash, usercode, docId }) {
    const c = getContract();

    console.log(`[Blockchain] Storing record: hash=${fileHash.slice(0, 12)}... usercode=${usercode}`);

    const tx = await c.storeRecord(fileHash, usercode, docId);
    const receipt = await tx.wait(1); // Wait for 1 confirmation

    console.log(`[Blockchain] ✓ Stored. TX: ${receipt.hash}`);
    return receipt.hash;
}
