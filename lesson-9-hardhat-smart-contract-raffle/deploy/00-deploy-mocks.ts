import { network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { BASE_FEE, developmentChains, GAS_PRICE_LINK } from "../helper-hardhat-config";

const func: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainName = network.name;

  if (developmentChains.includes(chainName)) {
    log("Local Network Detected, Deploying Mocks...");
    const args = [BASE_FEE, GAS_PRICE_LINK];
    const result = await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      log: true,
      args: args,
    });
    // log("deploy result is ");
    // log(result);
    log("Mocks Deployed!!");
    log("------------------------------------------");
  }
};
export default func;
func.tags = ["all", "mocks"];
