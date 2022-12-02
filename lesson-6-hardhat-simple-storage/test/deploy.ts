import { ethers } from "hardhat";

export class Main {
  async deploy() {
    const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await simpleStorageFactory.deploy();
    await simpleStorage.deployed();
  }
}
