import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain-types";
import { assert, expect } from "chai";
import { BigNumber } from "ethers";

describe("FundMe", async () => {
  let fundMe: FundMe;
  let deployer: string;
  let mockV3Aggregator: MockV3Aggregator;
  let sendValue: BigNumber = ethers.utils.parseEther("1");

  // before each describe we need to deploy and get contracts
  beforeEach(async () => {
    await deployments.fixture("all");
    deployer = (await getNamedAccounts()).deployer;
    fundMe = await ethers.getContract("FundMe", deployer);
    mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });

  describe("constructor", () => {
    it("Should set the owner correctly", async () => {
      const setOwner: string = await fundMe.i_owner();
      assert(setOwner == deployer, "Owner is not the deployer");
    });

    it("Should se the price feed contract correctly", async () => {
      const priceFeedAddress: string = await fundMe.priceFeed();
      // assert(priceFeedAddress == mockV3Aggregator.address, "price feed did not match");
      assert.equal(priceFeedAddress, mockV3Aggregator.address, "price feed did not match");
    });
  });

  describe("fund", () => {
    it("should reject any amount less than minimum amount", async () => {
      await expect(fundMe.fund({ value: ethers.utils.parseEther("0.001") })).to.be.revertedWith(
        "You need to spend more ETH!"
      );
    });

    it("updates the amount funded data structure", async () => {
      await fundMe.fund({ value: sendValue });
      const updatedAmount: BigNumber = await fundMe.addressToAmountFunded(deployer);
      assert.equal(updatedAmount.toString(), sendValue.toString(), "Amount did not match");
    });

    it("adds the new funder to the array", async () => {
      await fundMe.fund({ value: sendValue });
      const funder: string = await fundMe.funders(0);
      assert.equal(funder, deployer, "funder array not updated");
    });
  });

  describe("withdraw", () => {
    it("should allow address to withdraw exact amount", async () => {
      // Arrange
      const startingDeployerBalance: BigNumber = await fundMe.provider.getBalance(deployer);
      const startingContractBalance: BigNumber = await fundMe.provider.getBalance(fundMe.address);
      // console.log(`startingContractBalance is ${startingContractBalance}`);
      // console.log(`startingDeployerBalance is ${ethers.utils.formatEther(startingDeployerBalance)}`);

      // Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingDeployerBalance: BigNumber = await fundMe.provider.getBalance(deployer);
      const endingContractBalance: BigNumber = await fundMe.provider.getBalance(fundMe.address);
      // console.log(`endingContractBalance is ${endingContractBalance}`);
      // Assert
      assert.equal(
        startingContractBalance.toString(),
        endingContractBalance.toString(),
        "contract balance does not match"
      );
      assert.equal(
        startingDeployerBalance.toString(),
        endingDeployerBalance.add(gasCost).toString(),
        "wallet balance does not match"
      );
    });

    // it("allows us to withdraw with multiple funders", async () => {
    //   const accounts = await ethers.getSigners();
    //   // console.log(accounts.length);
    //   // console.log(accounts[0]);
    //   for (let i = 1; i < 6; i++) {
    //     await fundMe.connect(accounts[i]).fund({value: sendValue});
    //   }
    // });
  });
});
