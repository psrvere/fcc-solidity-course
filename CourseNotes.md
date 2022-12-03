# Course Notes

These are the WIP notes I am making while going through the tutorial. The objective was to absorb the content better and to be able to relook at these whenever I feel the need to do so. These are not comprehensive and I have also added a few extra information here and there. If you find any mistakes, please feel free to create a PR. Happy reading!

## Table of Contents

6. [Lesson 6 - Hardhat Simple Storage](#lesson-6---hardhat-simple-storage)
7. [Lesson 7 - Hardhat Fund Me](#lesson-7---hardhat-fund-me)

## Lesson 6 - Hardhat Simple Storage

### 6.1 Hardhat Setup

- `npm init -y` initialise npm project, it will create package.json
- `npm install --save-dev hardhat` install hardhat
- `npx hardhat` create a hardhat project (this will also install dependencies like ethers, chai, etc). After project creation, the same command can be used to list tasks.
- `npx hardhat compile` compile contracts
- `npx hardhat clean` deletes all compiled files/folders
- dependencies are required to run the project and dev dependencies are required only to build the project

### 6.2 Deploying Simple Storage From Hardhat

- Deploy script
  - `ethers` is imported from hardhat because hardhat ethers can keep track of different deployments and scripts. Hardhat ethers also know about contracts folder and if it has been compiled or not.
  - there are 3 steps to deploying a contract
    - `const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage")` create contract factory
    - `const simpleStorage = await simpleStorageFactory.deploy()` deploy the contract
    - `await simpleStorage.deployed()` wait for contract to be deployed

### 6.3 Networks in Hardhat

- hardhat default blockchain network is started at the time of deployment and stopped as soon as deployment script is over.
- walked through how to setup Ethereum testnet.

### 6.4 Programatic Verification

- install @nomiclabs/hardhat-etherscan plugin and setup etherscan API key in hardhat config - this will add a new task: verify
- verify can be run in command line or programatically
- `npx hardhat verify --help` get more info on tasks
- use run() to run hardhat tasks `import run from 'hardhat'`
- running any script with hardhat command will also automatically compile it
- use network to get network config details `import network from 'hardhat'` he used network to get chainId so that verification only runs for testnet

### 6.5 Interacting with Contracts in Hardhat:

- reading contract is a one step process `const value = await simpleStorage.retrieve()`
- writing to contract is a two step process
  - `const transactionResponse = await simpleStorage.store(7)`
  - `await transactionResponse.wait(1)`

### 6.6 Custom Hardhat Tasks

- use `task().setAction()` to defne a task, Patrick prefers using scripts over tasks - tasks are better for creating plugins and scripts are better for local development. task is imported from hardhat
- he defined a task to get current block number. use hre to access ethers `hre.ethers.getBlockNumber()`

### 6.7 Hardhat Localhost Node

- `npx hardhat node` spins up a local blockchain and unlike default hardhat network it will not be reset after running deploy script. Its chainId is `31337` same as hardhat network.
- you have to setup this as `localhost` in networks in hardhat config. accounts field is not needed

### 6.8 The Hardhat Console

- this is a way to interact with blockchain through console. `npx hardhat console --network goerli` will start the console. This is useful to quickly test/tinker an idea on blockchain.

### 6.9 Running Tests

- mocha is the testing framework used by hardhat along with chai which is an assertion library
- testing code structure:

```shell
describe("some text",async () => {
  beforeEach(async () => {
    // code
  })

  it("some text", async () => {
    //code
    // assertion statements
  })

  // can add more it and describe blocks here
})
```

- `yarn hardhat test --grep store` will run tests with `store` keyword
- it.only() - if .only() is present then only those tests will be run

### 6.10 Hardhat Gas Reporter

- `npm install --save-dev hardhat-gas-reporter`
- hardhat config:

```shell
gasReporter: {
  enabled: true,
  outputFile: "gas-reporter.txt",
  noColors: true,
  currency: "USD",
  coinmarketcap: COINMARKETCAP_API_KEY,
  token: "MATIC",
},
```

### 6.11 Solidity Coverage:

- `npm install solidity-coverage --save-dev` install the pluging
- `npx hardhat coverage` run hardhat task to get converage report

### 6.12 Typescript

- additional packages needed - installed by default while creating typescript project along with tsconfig.json file
  - @typechain/ethers-v5
  - @typechain/hardhat - typechain plugin for hardhat which allows use of typechain and typescript natively together. This also adds a new taks `typechain` which generates typings for compiled contracts
  - @types/chai
  - @types/node
  - @types/mocha
  - ts-node
  - typechain - gives contracts the correct typing
  - typescript

### Extra Information

- <u>Namespacing:</u>

  - node modules starting @ are called 'scoped packages' allowing NPM packages to be namespaced. Organisations can use this to differentiate between official and unofficial packages
  - namespacing for functions/classes is equivalent to scoping in variable. Think of this as using surnames to differencite two people with same names.

- <u>What is Hoisting in Javascript</u> - var is hoisted, let and const are not. Hoisting moves declarations to the top of the code. Only declarations are hoisted, initialisations are not.

```shell
console.log(item); // undefined
var item = 5;

console.log(num); // throw error
let num = 4;
```

- <u>Function declarations vs Function expressions</u> - Function declarations are hoisted, function expressions are not as function expressions are initialising the variable

- Files with extention .d.ts are <u>typescript declarations</u> file which contain types information but no implementation information. These files do not produce .js files on compilation. These are only used for typechecking. Typescript declarations are created on compile and cleared with `npx hardhat clear` command.

- <u>TransactionResponse vs TransactionReceipt</u> - Both are objects in ethers js. The former one is returned when block is not mined and the latter one is return when the block has been mined. The latter one also has information on gas used, logs, etc. Calling a state change function of a contract will return TransactionResponse object. We can get TransactionReceipt object by using wait(1) method on TransactionResponse.

- <u>What is a contract factory and why is it needed?</u> - To create a contract initcode, a type of bytecode, is needed. This information is not present in the contract.

## Lesson 7 - Hardhat Fund Me

### 7.1
