import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);

    const MediaRegistry = await ethers.getContractFactory("MediaRegistry");
    const contract = await MediaRegistry.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log("✅ MediaRegistry deployed to:", address);
    console.log("Add this to your .env: BLOCKCHAIN_CONTRACT_ADDRESS=" + address);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
