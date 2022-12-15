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

### 7.1 Linting

- eslint is a linter for javascript
- solhint is a linter for solidity
- install solhint globally `npm install -g solhint` and initialise with `solhint --init`. Change extents to "solhint:recommended" in json file
- run with command `solhint contracts/FundMe.sol`

### 7.2 Hardhat Setup

- setup a new project, `npm init -y` is not needed, `npx install hardhat --save-dev` also initialises the project
- install @chainlink/contracts library

### 7.3 Hardhat Deploy

- What is the problem with deploy scripts?
  - there is no way to track deployments
  - some issue with tests and deploy script not working hand in hand
  - solution is to use `hardhat-deploy` package, install using `npm install --save-dev hardhat-deploy`
  - it will run all the scripts which are added to deploy folder by running the command `npx hardhat deploy`
  - `hardhat-deploy` uses `hardhat-deploy-ethers`. We are already using `hardhat-ethers` in place of `ethers`. A few other hardhat plugins may be using `hardhat-ethers`. Hence we install `hardhat-deploy-ethers` in such a way that `hardhat-deplpy-ethers` over rides `hardhat-ethers` and we continue to use `hardhat-ether` i.e. we import `hardhat-ethers` in the confi file. The instruction on how to do so in in the `hardhat-deploy` documentation
  - `hard-deploy` plugin will extend the hre object by adding `getNamedAccounts`, `deployments` and a couple of other things. It will also extend the `HardhatConfig` object by adding `namedAccounts` and a few other config options. `namedAccounts` allows us to associate names to addresses and have them configured per chain.

### 7.4 Mocking and Helper Hardhat Config

We have to addres following two challenges while working with Chainlink price feed contracts on hardhat

a) What is the problem with deploying chainlink price feeds on hardhat local network?

- Chainlink price feed contracts only exists on testnest and mainnets.
- Solution: use Mocks. Mocking is creating other objects that simulate behaviour of real objects
- we refactored the code to take priceFeed at the time of deploying the contract

b) What if we want to change chains for deployment?

- Solution: We need a way to paramaterize the price feed contract address
- Aave used `helper-hardhat-config.ts` to get price feed address for a given chainId
- And a mock contract is created which is deploye if chainId = 31337

- What are the steps in hardhat-deploy deploy process?

  - import `getNamedAccounts` and `deployments` from hre
  - `getNamesAccounts` gets `namedAccounts` from config file. Then we can import `deployer` from `getNamedAccounts`
  - from `deployments` import
    - `deploy` - will deploy smart contract - it returns a DeployResult object containing abi, bytecode, address, receipt etc.
    - `log` - will automatically log a lot of things that we were earlier writing console.logs for and we can also use to log a few things manually
    - `get` - will get smart contract object
    - `deployments.fixtures("all")` will deploy all scripts before runing tests
    - `hardhat-deploy` wraps ethers so that we can get latest contract by `await ethers.getContract("FundMe", deployer)`

- `npx hardhat deploy --tags mocks` will run all deploy scripts with mocks tag
- if we spin up the hardhat local node then hardhat-deploy will automatically run all the deploy scripts and start node with our contracts already deployed.

### 7.5 Utils Folder

- etherscan contract verification function was moved to utils folder

### 7.6 Solidity Style Guide

- Order of Layout

  - Pragma Statement
  - Import Statements
  - Error Codes - naming convention: ContractName\_\_ErrorName
  - Imports
  - Interfaces
  - Libraries
  - Contracts
    - Type Declarations
    - State Variables
    - Events
    - Modifiers
    - Functions
      - constructor
      - receive
      - fallback
      - external
      - public
      - internal
      - private
      - view / pure

- NatSpec - Ethereum Natural Language Specification Format: Helps document the code
  - starts with /// or /\*\* \*/
  - @title - only at contract level
  - @author - only at contract level
  - @notice
  - @dev
  - @param
  - @return
  - @custom:name

### 7.7 Testing Fund Me

- wrote units tests (run locally) - can be done on local hardhat and forked hardhat network
- staging/integration tests (run on testnet)
- we will setup tests in such a way that both of the depoy functions have been run using deployments of hardhat-deploy - earlier we had to add deployment code again in our tests
- `await deployments.fixture("all")` - use this in testing contract to run all deployment scripts with "all" tag
- `const fundMe = await ethers.getContract("FundMe", deployer)` - hardhat-deploy wraps ethers with function called `getContract` which returns the latest deployment of that contract
- There are two ways to get accounts:
  - `const accounts = await ethers.getSigners()` - this will get all accounts from the accounts in network object in config file
  - `const { deployer } = await getNamedAccounts()` - this will get accounts from namedAccounts section in hardhat config file
- When you expect transactions to be revertes use Waffle expect() - `await expect(fundMe.fund()).to.be.reverted` or you mention the exact error you are expecting: `await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!")`. NOTE that there is no await before fundMe.fund().
- expect is also imported from chai which is over written by Waffle to provide expect()
- Arrange, Act, Asset framework to write tests
- How to get gas cost? - `const { gasUsed, effectiveGasPrice } = transactionReceipt`, gasCost = gasUsed.add(effectiveGasPrice).
- we need to connect an account to a contract if it is not the deployer account using `const fundMeConnectedContract = fundMe.connect(account)`
- he wrote separate describe blocks for each function in unit tests
- syntax of sending values in solidity from one contract to another is `fundMe.fund{value: 1 ether}()` and in typescript test file the syntax is `fundMe.fund({value: ethers.util.parseEther("1")})`.
- How to get balance of deployer? `await fundMe.provider.getBalance(deployer)`. We can get balance of connected account or of contract with this.
- Solidity create getter function for all public variable automatically by the same name
- asset.equal can compare two string and not two Big Numbers

### 7.8 Storage in Solidity

- Immutables and constants are stored as part of the bytecode. How to extract these?
- `await ethers.provider.getStorageAt(contractAddress,i)` will get the storage variable stored in contract with address contractAddress at i<sup>th</sup> slot.
- Fun with Storage Contract
- dynamic arrays use push method and static arrays use array[i] for assignment;
  - How are arrays stored?
    - first slot is length of array
    -
- each storage slot has a length of 32 bytes (256 bits)
- <u>Fixed size arrays</u> do not store length but store each element in a new slot. So a uint256[4] array will take 4 slots, uint128[4] will take 2 slots and uint64[4] will take 1 slot, uint64[5] will take two slots with only one element in the second slot - no other data is aded to this second slots, it is exclusively for the array. If multiple data is stored in a single slot, it is stored from right to left i.e. earlier members on right.

- Fixed size Variables

  - `address` has 40 hexadecimal characters i.e. 160 bits or 20 bytes
  - `bool` needs only 1 bit but smallest data type is 8 bits/1 byte in solidity
  - `uintX` X bits, minimum 8 bits to maximum 256 bits

- Dynamic Size Variables

  - Dynamic Arrays

    - length is stored in the memory slot sequentially along with other declared variables. It takes an entire slot (lenghStorageSlot).
    - Since number of total elements is dynamic, elements are stored in varied locations using Keccac-256 hashing
    - the first element is at the location web3.utils.soliditySha3(lenghStorageSlot) = firstElementLocation

    - byte arrays and string are exceptions - why?

  - ## Sha3 and Keccac256 Rabbit hole
  - `ethers.utils.keccak256()` take Bytelike input i.e. bytes or string

- <u>Strings</u> are - how are stings stored? what is the number in the last digit? How does this change when we long string?

  - [What is UTF-8 Encoding?](https://blog.hubspot.com/website/what-is-utf-8)
  - Some historic perspective:
  - <u>ASCII (American Standard Code for Information Interchange)</u> was one of the early standardisation launched in 1960. It standarised 127 characters. Another extended version was launched to add additonal charaters which standarised a total of 256 characters. [ASCII tables](https://blog.hubspot.com/website/what-is-utf-8)
  - As number of characters used in computers grew globally, developers started building and using multiple standards to suppport these character. Then Unicode was to introduced to support all characters possible.
  - <u>Unicode</u> - It is called unicode because there is a unique code for each character called code point. Examples: A = 41, a = 61, 0 = 30, Ø = 00D8, 😁 = 1F601. It has backward compatability with ASCII. There are a million plus code points.
  - <u>UTF-8 (Unicode Transformation Format - 8 bits)</u> is an encoding system for Unicode which converts each unicode charater in bytes. It covers all charaters used in computer systems globally. Examples: 0 = 30, 1 = 31, A = 41, a = 61, Ø = c3 98, 😄 = f0 9f 98 84. It uses less number of bytes for most common characters and more number of bytes for less common characters like phi and emojis. It is the dominant encoding for internet.

  - How is Unicode converted to hexadecimal data which is stored in solidity storage slots?

    - Let's take an [example](https://en.wikipedia.org/wiki/UTF-8), Unicode for € (euro sign) is U+20AC - this are 4 hexadecimal digits
    - hex(20AC) = 0010 0000 1010 1100 in binary. A single hexadecimal digits is 4 bits.
    - Now UTF-8 encoding can be between 1-4 bytes. Following are the ranges of code points with bytes
      1. U+0000 to U+00FF(128) - 128 codepoints. 0xxxxxxxx - 1 byte, always starts with zero.
      2. U+0080 to U+07FF(2047) - 1920 codepoints. 110xxxxxx 10xxxxxx - 2 bytes, first byte starts with 110 and second one starts with 10 - always
      3. U+0800 to U+FFFF(65535) - 61440 codepoints. 1110xxxx 10xxxxxx 10xxxxxx - 3 bytes
      4. U+10000 to U+10FFFF() - 1048576 codepoints. 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx - 4 bytes
    - We can go further deep into how Unicode codespaces are designed but we will not for now.
    - Back to example, since 20AC = 8364 is in the 3rd group of codepoints, it is going to be 3 bytes long. So here is how we construct these three bytes:

    ```
              0010       0000 1010      1100
              |          |   |    \      |
              |          |   |     \     |
        (1110 0010) (10 0000 10)(10 10 1100)
    ```

    - hence UTF-8 binary encoding of € is 11100010 10000010 10101100, which can be concisely written in hexadecimal as E2 82 AC - and this is what solidity storage slot will store
    - Solidity will store € as 0xe282ac0000000000000000000000000000000000000000000000000000000006

  - strings in solidity are stored as UTF-8.
  - the last bytes i.e. last two digits of 32 byte storage slot is used to store the number of what?
  - if there are 62 bytes or less than the content then where does the content go?
  - ASCII characters can by written directly and unicode strings needs to defined with unicode prefix `string name = unicode"Ø"`
  - How to calculate string length? string does not have .length member. We can not use bytes(stringVariable).length/2 as some characters like phi/emojis can use more than 1 byte of storage. Instead use [StringUtils.sol](https://gist.github.com/AlmostEfficient/669ac250214f30347097a1aeedcdfa12)

abc

- are declared variables stored?
  - uint variable are stored with default 0 value, bool with default value 0 (false)
  - fixed length arrays of length 10 will take 10 slots with default values
  - dynamic array length is store as 0
- how does solitiy know if a slot with 0x0 is boolean, uint or an empty dynamic array or a mapping?

### 7.9 Gas Optimizations using storage knowledge

- SSTORE cost 20k gas, SLOAD costs 800
- created a cheaper withdraw function to reduce gas cost by defining a memory funders array to store storage funder array
- mappings can not be defined in memory

### 7.10 Solidity Chainlink Style Guide

- changes visibility of storage variables from public to private and wrote getter functions. Why did we do this? - so that the external people who interact with the contract do not have to deal with s_variables.

### 7.11 Staging Tests

- in staging tests we do not need to do `await deployments.fixtures["all"]` or deploy contract as we are assuming contracts are already deployed (units tests will run before staging test). Hence we just get contract.
- added a ternary operator to skip test if network is not test net `!developmentChains.includes(network.name) ? describe.skip : describe()`
- run units tests on hardhat network and staging on testnet

## Lesson 8 - HTML/Javascript Fund Me

- use `window.ethereum` or `window.solana` to access wallets in browser console. Wallets expose blockchain node (provider object) under the hood i.e. wallets are our connection to the blockchain.

### HTML Setup, Connecting to Metamask

- We will use HTML + javascript in this lesson
- use ! to auto fill index.html file
- install live server to be able to spin up HTML website
- `window.ethereum.request({method: "get_ethAccounts})` will prompt metamask to connect to website
- added a button and used `document.getElementById("connectButton").innerHTML = "Connected!"` to change button text
- And then we moved the script code to a separate js file

### ES6 Front End JS vs NodeJS

- use import instead of require and do not use npm install
- copy ethers code from ethers documentation - this is the front end file version
- In script section of index.html use `type: text/javascript` for only js files and `type: module` once you have imported modules in js file. On changing it to module connect buttons won't work and would be needed to define these in js file as well.

### Sending a Transaction From a website

- to send money to a contract we need contract address, contract ABI and signer
- use `constants.js` file to store ABI and contract address. ABI is taken from the compiled artifacts folder and contract address is taken by running a local node on hardhat in backend
- use `const provider = ethers.providers.Web3Provider(window.ethereum)` to wrap metamask as a provider and call `const signer = provider.getSigner()` method on this provider to get the signer
- create new contract using `const contract = new ethers.Contract(contractAddress, abi, signer)`
- I added hardhat network to metamask and imported hardhat wallet (#11) too
- You will have to reset metamask account as and when you restart local blockchain node as nonce on a fresh blockchain should be 0 for first transaction and metamask will have non zero nonce as there were a few transaction done on previous instance of local blockchain.

### Listening for Events and completed Transactions

- we listen for transactions to be mined as well as events
- use `provider.once(eventName, listener)` to listen to an event (eventName) with a callback function (listener). It is added to the JS event loop and front end periodically checks if this is finished.
- Other way is to wrap this listeners in a Promise and return it - `new Promise((resolve, reject) => {above function + add resolve()})`

### Input Forms

- for html tags, if you do not want to put anything between them, you can shortened it like this `<input some content />`
- get input for transfer value using `const ethAmount = document.getElementById("ethAmount").value`

### Reading from the Blockchain

```shell
const provider = new ethers.providers.Web3Provider(window.ethereum);
const balance = await provider.getBalance(contractAddress);
```

### Withdraw Function

- changed the default deployer from 0 to 11 as I added 11 index account to metamask
- withdraw front end function was similar to fund me function

## Lesson 9 - Hardhat Smart Contract Raffle/Lottery

- `hardhat-toolbox` plugin has following plugins - ethers.js, hardhat-ethers, mocha, chai, hardhat-etherscan, hardhat-gas-reporter, solidity-coverage, typechain, a couple of more plugins
- extra plugins needs to be installed: hardhat-deploy, dotenv, hardhat-contract-sizer, solhint, prettier, prettier-plugin-solidity

### Introduction to Events

- emit events on update of dynamic data structures
- Contracts can not access logs data structure after it has been created. Smart contract can only access storage memory but storage memory costs more gas. Events are cheaper that way. Non indexed events are cheaper than indexed events
- events are stored in logs data structure
- we can have up to 3 indexed parameters called topics. Indexed parameters are searchable. Non indexed events get abi encoded and you have to know the abi to access these.
- Logs data structure has 4 fields: 1) contract/account address from where event is emitted, 2) name and fields of event, 3) topics and 4) data - abi encoded non indexed data

### Chainlink VRF Version 2

- In Version 1, we used to fund our contract with link. In version 2 we fund a subscription manager. It is an account which let us fund and maintain balance for multiple consumer contracts
- There are two contracts used for this:
  - 1. The VRF Coordinator - `VRFCoordinatorV2Interface` interacts with VRF oracle to get random number using `requestRandomWords` function
  - 2. The VRF Consumer - `VRFConsumerBaseV2` contract which has `fulfillRandomWords` function to verify the random word. Our Raffle contract inherited `VRFConsumerBaseV2` and we created an instance of `VRFCoordinatorV2Interface` in Raffle contract to get random variable
  - Add contract address of VRF (Verifiable Random Function) Consumer in subscription dashboard on Chainlink to let it spend Link from subscription manager
-
- In `requestRandomWords` function arguments:
  - `keyHash` or gasLane is the max gas we want to spend while requesting random number using `requestRandomWords` function and `callbackGasLimit` is the max amount of gas we are willing to spend to verify the random number using function `fulfillRandomWords`
  - `subscriptionId` is the id of subscription which will fund the contract for request
  - `requestConfirmations` # of confirmations to wait for Chainlink node before responding
  - `requestRandomWords` returns a requestId
-
- `fulfillRandomWords` function arguments:

  - `requestId` is created by `requestRandomWords`
  - random words array

- Getting random number is a two step process so that no one can fuzz the number: 1) The Request and 2) The Fulfill
- External functions use less gas than public functions

### Hardhat Shorthand

- `hardhat-shorthand` npm package allows using `hh` in place of `npx hardhat`

### Chainlink Keepers

- we used `KeeperCompatibleInterface`. This contract address needs to registered with Chainlink in Register new Upkeep section: It has two functions
  - `checkUpkeep` function - run by chainlink Node
    - `bytes calldata checkData` - a lot of advanced things can be done by using this bytes variable like calling another function etc.
  - `performUpkeep` function
- create a new enum type for raffle state variable
- user `block.timestamp` to get current timestamp
- if upkeepNeeded is true then contract should automatically call getRandomNumber function - renamed this function to performUpkeep
- why did he wrap enum in uint256?
- reset array using `array = new address payable[](0)`
- calldata doesn't work with strings, we need to pass it as memory variable
- reading Constant and Immutable data does not count as reading i.e. functions can be pure because the data is stored in bytecode of contract.
