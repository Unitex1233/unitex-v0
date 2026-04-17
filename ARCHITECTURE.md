# UniteX — Hybrid Architecture Setup

## Architecture Overview

```
User → React (Vite) → Media Service (Docker) → Docker Volume (files)
                    ↓                         ↓
                Firebase (auth + metadata)   Blockchain (hash proof)
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| React Frontend | 3004 | Vite dev server |
| Media Service | 4000 | Docker Express upload API |
| Firebase | Cloud | Auth, Firestore, RTDB |
| Blockchain | Polygon Amoy | On-chain media proof |
| Local Hardhat | 8545 | Dev-only local chain |

## Quick Start

### 1. Configure environment
```bash
cp .env.example .env
# Fill in your Firebase and blockchain credentials
```

### 2. Add Firebase service account
- Go to Firebase Console → Project Settings → Service Accounts
- Click "Generate new private key"
- Save as `service-account.json` in the project root

### 3. Start media service (Docker)
```bash
docker compose up -d media-service
```

### 4. Deploy smart contract (testnet)
```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network amoy
# Copy the contract address to .env: BLOCKCHAIN_CONTRACT_ADDRESS=0x...
```

### 5. Start frontend
```bash
cd client
npm run dev
```

## Media Upload Flow

1. User picks a file in the React UI
2. `useMediaUpload` hook fetches user's `usercode` from Firestore
3. File posted to `POST http://localhost:4000/upload` with `{ file, uid, usercode }`
4. Media service:
   - Validates (type + size)
   - Compresses image to WebP via sharp
   - Writes to Docker volume (`/app/uploads`)
   - Generates SHA-256 hash
   - Saves metadata to Firestore (`media/{docId}` + `users/{uid}/media/{docId}`)
   - Calls `MediaRegistry.storeRecord(hash, usercode, docId)` on-chain
5. Frontend receives `{ mediaURL, fileHash, txHash }`

## Blockchain

**Contract**: `MediaRegistry.sol`  
**Chain**: Polygon Amoy Testnet (free) / Polygon Mainnet (production)  
**Owner ref**: `usercode` (4-char alphanumeric — the user's identity anchor across the platform)

### Key functions
```solidity
storeRecord(fileHash, usercode, docId)  // Write
verifyRecord(fileHash) → (exists, usercode, timestamp)  // Read
getUserMedia(usercode) → string[]  // Get all hashes by user
```

## Folder Structure

```
/
├── client/                    # React frontend (Vite)
│   └── src/hooks/useMediaUpload.ts  # Upload hook
├── media-service/             # Docker Express API
│   ├── index.js
│   ├── services/
│   │   ├── firebase.js
│   │   └── blockchain.js
│   └── Dockerfile
├── blockchain/                # Smart contracts
│   ├── contracts/MediaRegistry.sol
│   ├── scripts/deploy.js
│   └── hardhat.config.js
├── docker-compose.yml
└── .env.example
```
