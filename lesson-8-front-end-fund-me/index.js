import { ethers } from "./ethers-5.1.esm.min.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundMeButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

async function connect() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("connected!");
    connectButton.innerHTML = "Connected!";
  } else {
    connectButton.innerHTML = "Please Install Metamask";
  }
}

async function fund() {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
  } else {
    fundButton.innerHTML = "Please Install Metamask";
  }
}
