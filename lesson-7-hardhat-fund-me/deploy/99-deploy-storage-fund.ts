import { BytesLike, keccak256, solidityKeccak256, soliditySha256, toUtf8Bytes } from "ethers/lib/utils";
import { ethers, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains } from "../helper-hardhat-config";
import web3 from "web3";

const deployFunc: DeployFunction = async ({ getNamedAccounts, deployments }) => {
  // const { deploy, log } = deployments;
  // const { deployer } = await getNamedAccounts();
  // log("----------------------------------------------------");
  // log("Deploying FunWithStorage and waiting for confirmations...");
  // const funWithStorage = await deploy("FunWithStorage", {
  //   from: deployer,
  //   args: [],
  //   log: true,
  //   waitConfirmations: 1,
  // });
  // // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
  // //   await verify(funWithStorage.address, []);
  // // }
  // log("Logging storage...");
  // for (let i = 0; i < 10; i++) {
  //   log(`Location ${i}: ${await ethers.provider.getStorageAt(funWithStorage.address, i)}`);
  //   if (i == 9) {
  //     log("inside");
  //     const zeroElementLocationEthers: BytesLike = solidityKeccak256(
  //       ["string"],
  //       ["0x0000000000000000000000000000000000000000000000000000000000000000"]
  //     );
  //     log(`zeroElementLocationEthers is ${zeroElementLocationEthers}`);
  //     log(
  //       `zeroElementLocationEthersKeccak is ${keccak256(
  //         "0x0000000000000000000000000000000000000000000000000000000000000000"
  //       )}`
  //     );
  //     const zeroElementLocationWeb3 = web3.utils.soliditySha3(
  //       "0x0000000000000000000000000000000000000000000000000000000000000000"
  //     );
  //     log(`zeroElementLocationWeb3 is ${zeroElementLocationWeb3}`);
  //     // log(keccak256(toUtf8Bytes("2")));
  //     log(
  //       `first element data -- ${await ethers.provider.getStorageAt(funWithStorage.address, zeroElementLocationWeb3)}`
  //     );
  //     const secondElementLocationWeb3 = zeroElementLocationWeb3 + 1;
  //     log(`secondElementLocationWeb3 is ${secondElementLocationWeb3}`);
  //     log(`${secondElementLocationWeb3.toString()}`);
  //     log(
  //       `second element data -- ${await ethers.provider.getStorageAt(
  //         funWithStorage.address,
  //         secondElementLocationWeb3
  //       )}`
  //     );
  //     // const secondElementLocation =
  //   }
  // }
  // You can use this to trace!
  // const trace = await network.provider.send("debug_traceTransaction", [
  //     funWithStorage.transactionHash,
  // ])
  // for (structLog in trace.structLogs) {
  //     if (trace.structLogs[structLog].op == "SSTORE") {
  //         console.log(trace.structLogs[structLog])
  //     }
  // }
  // const firstelementLocation = ethers.utils.keccak256(
  //     "0x0000000000000000000000000000000000000000000000000000000000000002"
  // )
  // const arrayElement = await ethers.provider.getStorageAt(
  //     funWithStorage.address,
  //     firstelementLocation
  // )
  // log(`Location ${firstelementLocation}: ${arrayElement}`)
  // Can you write a function that finds the storage slot of the arrays and mappings?
  // And then find the data in those slots?
};

export default deployFunc;
deployFunc.tags = ["storage"];
