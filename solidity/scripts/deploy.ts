import { ethers } from "hardhat";

async function main() {
    const Poll = await ethers.getContractFactory("Poll");
    const contract = await Poll.deploy("testName", ["option1", "option2"]);

    await contract.waitForDeployment();

    console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
