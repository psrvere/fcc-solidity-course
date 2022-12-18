import { BigNumber, ContractReceipt, ContractTransaction } from "ethers";
import { ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

const VRF_SUB_FUND_AMOUNT: BigNumber = ethers.utils.parseEther("2");

const deployFunc: DeployFunction = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainName: string = network.name;
  const chainId: number = network.config.chainId!;
  let vrfV2CoordinatorAddress: string, subscriptionId: string;

  if (developmentChains.includes(chainName)) {
    const vrfV2CoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfV2CoordinatorAddress = vrfV2CoordinatorV2Mock.address;
    console.log(`vrfV2CoordinatorAddress is ${vrfV2CoordinatorAddress}`);

    // get subscription id
    const transactionResponse = await vrfV2CoordinatorV2Mock.createSubscription();
    const transactionReceipt: ContractReceipt = await transactionResponse.wait(1);
    subscriptionId = transactionReceipt.events![0].args!.subId;
    console.log(`subscriptionId is ${subscriptionId}`);
    // Fund subscription
    await vrfV2CoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);
  } else {
    vrfV2CoordinatorAddress = networkConfig[chainId!]["vrfCoordinatorV2"]!;
    subscriptionId = networkConfig[chainId]["subscriptionId"]!;
  }

  const entranceFee: BigNumber = networkConfig[chainId]["entranceFee"];
  const gasLane: string = networkConfig[chainId]["gasLane"];
  const callbackGasLimit: string = networkConfig[chainId]["callbackGasLimit"]!;
  const interval: string = networkConfig[chainId]["interval"];

  const args = [vrfV2CoordinatorAddress, entranceFee, gasLane, subscriptionId, callbackGasLimit, interval];
  console.log(args);

  console.log("deploying contract.........");
  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    waitConfirmations: network.config.chainId == 31337 ? 1 : 3,
    log: true,
  });
};

export default deployFunc;
deployFunc.tags = ["all", "raffle"];
