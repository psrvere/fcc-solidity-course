import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";

const BASE_FEE = ethers.utils.parseEther("0.25");
const GAS_PRICE_LINK = 1e9;

const networkConfig: Record<number, ConfigData> = {
  5: {
    name: "goerli",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    subscriptionId: "0",
    callbackGasLimit: "500,000", // units of gas
    interval: "30", // secs
  },
  137: {
    name: "polygon",
    ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane: "0x6e099d640cde6de9d40ac749b4b594126b0169747122711109c9985d47751f93", // 200 gwei
    callbackGasLimit: "500000",
    interval: "30", // secs
  },
  31337: {
    name: "hardhat", // copy the block for localhost
    entranceFee: ethers.utils.parseEther("1"),
    gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // used goerli address, throws error on being empty
    callbackGasLimit: "500000",
    interval: "30", // secs
  },
};

const developmentChains: string[] = ["hardhat", "localhost"];

type ConfigData = {
  name: string;
  vrfCoordinatorV2?: string;
  ethUsdPriceFeed?: string;
  entranceFee: BigNumber;
  gasLane: string;
  subscriptionId?: string;
  callbackGasLimit?: string;
  interval: string;
};

export { networkConfig, developmentChains, BASE_FEE, GAS_PRICE_LINK };
