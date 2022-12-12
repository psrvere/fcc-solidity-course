import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundMeButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("connected!");
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Please Install Metamask";
  }
}

async function getBalance() {
  if (window.ethereum) {
    // const provider = await ethers.providers.Web3Provider(window.ethereum);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    // console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) });
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
    } catch (e) {
      console.log(error);
    }
  } else {
    fundButton.innerHTML = "Please Install Metamask";
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`mining ${transactionResponse.hash}.....`);
  // create a listener for the blockchain
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);
      resolve();
      // can add code to reject on timeout
    });
  });
}

async function withdraw() {
  if (window.ethereum) {
    console.log("withdrawing");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    console.log("before trying");
    try {
      console.log("in try");
      const transactionResponse = await contract.withdraw();
      console.log("transactionResponse done");
      await listenForTransactionMine(transactionResponse, provider);
      console.log("Done!");
    } catch (e) {
      console.log(error);
    }
  } else {
    fundButton.innerHTML = "Please Install Metamask";
  }
}
