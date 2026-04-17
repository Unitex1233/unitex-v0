const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with:", deployer.address);

    const MediaRegistry = await ethers.getContractFactory("MediaRegistry");
    const contract = await MediaRegistry.deploy();
    await contract.waitForDeployment ? await contract.waitForDeployment() : await contract.deployed();

    const address = contract.target || contract.address;
    console.log("✅ MediaRegistry deployed to:", address);
    console.log("Add this to your .env: BLOCKCHAIN_CONTRACT_ADDRESS=" + address);
}

main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});
