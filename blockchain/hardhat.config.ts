import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: any = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    // Local Hardhat node (for dev testing)
    localhost: {
      type: "http",
      url: "http://127.0.0.1:8545"
    },
    // Polygon Amoy Testnet (free, fast, public)
    amoy: {
      type: "http",
      url: process.env.POLYGON_AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/",
      accounts: process.env.BLOCKCHAIN_PRIVATE_KEY
        ? [process.env.BLOCKCHAIN_PRIVATE_KEY]
        : [],
      chainId: 80002,
    },
    // Polygon Mainnet (production)
    polygon: {
      type: "http",
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.BLOCKCHAIN_PRIVATE_KEY
        ? [process.env.BLOCKCHAIN_PRIVATE_KEY]
        : [],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
  },
};

export default config;
