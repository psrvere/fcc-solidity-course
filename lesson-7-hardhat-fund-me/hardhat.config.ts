import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
import "hardhat-deploy";

dotenv.config({ path: "../.env" });

const GOERLI_RPC_URL: string = process.env.GOERLI_RPC_URL!;
const PRIVATE_KEY: string = process.env.PRIVATE_KEY!;
const ETHERSCAN_API_KEY: string = process.env.ETHERSCAN_API_KEY!;
const COINMARKETCAP_API_KEY: string = process.env.COINMARKETCAP_API_KEY!;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  solidity: {
    compilers: [{ version: "0.8.17" }, { version: "0.6.6" }],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-reporter.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    token: "MATIC",
  },
  namedAccounts: {
    deployer: {
      default: 11,
    },
    user: {
      default: 1,
    },
  },
};

export default config;
