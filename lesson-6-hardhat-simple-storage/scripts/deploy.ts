import { ethers, run, network } from "hardhat";

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await simpleStorageFactory.deploy();
  console.log("deploying contract...");
  await simpleStorage.deployed();
  console.log(`deployed contract to ${simpleStorage.address}`);

  // if (network.config.chainId == 5 && process.env.ETHERSCAN_API_KEY) {
  //   console.log("Waiting for block confirmations...");
  //   await simpleStorage.deployTransaction.wait(6);
  //   await verify(simpleStorage.address, []);
  // }

  const currentValue = await simpleStorage.retrieve();
  console.log(`currentValue is: ${currentValue}`);

  const transactionResponse = await simpleStorage.store(999);
  const transactionReceipt = await transactionResponse.wait(1);
  // console.log(transactionReceipt);
  const updatedValue = await simpleStorage.retrieve();
  console.log(`updatedValue is: ${updatedValue}`);
}

async function verify(contractAddress: string, args: any[]) {
  console.log("Verifying contract....");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e: any) {
    console.log(e);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
