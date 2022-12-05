import { network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, DECIMALS, INITIAL_ANSWER } from "../helper-hardhat-config";

const func: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainName = network.name;

  console.log(chainName);
  if (developmentChains.includes(chainName)) {
    log("Local Network Detected, Deploying Mocks...");
    const result = await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    // log("deploy result is ");
    // log(result);
    log("Mocks Deployed!!");
    log("------------------------------------------");
  }
};
export default func;
func.tags = ["all", "mocks"];
