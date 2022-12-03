import { ethers } from "hardhat";
import { SimpleStorage, SimpleStorage__factory } from "../typechain-types";
import { assert, expect } from "chai";

describe("tests cases for SimpleStorage Contract", async () => {
  let simpleStorageFactory: SimpleStorage__factory;
  let simpleStorage: SimpleStorage;
  beforeEach(async () => {
    // deploy the contract
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
    await simpleStorage.deployed();
  });

  it("should have zero starting value", async () => {
    const startingValue: string = (await simpleStorage.retrieve()).toString();
    assert.equal(startingValue, "0", "not starting with 0");
  });

  it("value can be updated to another value", async () => {
    const newValue: string = "78";
    const transactionResponse = await simpleStorage.store(newValue);
    await transactionResponse.wait(1);

    const updatedValue: string = (await simpleStorage.retrieve()).toString();
    assert.equal(updatedValue, newValue, "Value could not be updated");
  });
});
