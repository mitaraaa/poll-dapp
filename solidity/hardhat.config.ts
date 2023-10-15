import "@nomicfoundation/hardhat-toolbox";
import { config as dotEnvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "solidity-coverage";

dotEnvConfig();

const config: HardhatUserConfig = {
    solidity: "0.8.19",
};

export default config;
