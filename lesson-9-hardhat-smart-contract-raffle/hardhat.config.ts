import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
};

export default config;
