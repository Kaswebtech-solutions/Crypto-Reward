import { Web3Provider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

console.log("working!!!");

// Define the provider variable
let provider;

// Define the connected status text
const CONNECTED = "Connected";

// Function to initialize and return a Web3Modal instance
async function getWeb3Modal() {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true, // Optional - cache the provider
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          // for live prod: process.env.INFURA_ID
          infuraId: process.env.INFURA_ID,
        },
      },
      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: "APP NAME", // Specify the app name
          infuraId: process.env.INFURA_ID,
        },
      },
    },
  });
  return web3Modal;
}

// Function to connect the wallet
async function connectWallet() {
  // Get the Web3Modal instance
  const web3Modal = await getWeb3Modal();
  
  // Connect to the wallet
  const connection = await web3Modal.connect();
  console.log(connection);
  
  // Initialize the provider with the connected wallet
  provider = new Web3Provider(connection);
  console.log(provider);
  
  // Get the list of accounts (wallet addresses) from the provider
  const accounts = await provider.listAccounts();
  console.log(accounts);
  
  // Check if there is at least one account
  if (accounts[0]) {
    // Change the button text to "Connected"
    const button = document.getElementById("connect-wallet-button");
    button.textContent = CONNECTED;
    
    // Store the wallet address in localStorage
    localStorage.setItem("fullAddr", accounts[0]);
    
    // Log the customer's wallet address to the console
    console.log("Customer's wallet address:", accounts[0]);
  }

  // Return if there are no accounts
  if (accounts.length === 0) return;
}

// Ensure the code runs in a browser environment
if (typeof window !== "undefined") {
  // Add an event listener for the DOMContentLoaded event to execute code after the DOM is fully loaded
  window.addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault(); // Prevent the default event behavior
    
    // Get the stored wallet address from localStorage
    const stored = localStorage.getItem("fullAddr");
    
    // Log the stored wallet address to the console
    console.log("Stored wallet address:", stored);
    
    // Get the connect wallet button element by its ID
    const button = document.getElementById("connect-wallet-button");
    
    // Add an event listener to the button to trigger the connectWallet function when clicked
    button.addEventListener("click", connectWallet);
    
    // Check if Ethereum is available in the window object and if there is a stored address
    if (window.ethereum && stored) {
      // Change the button text to "Connected"
      button.textContent = CONNECTED;
    }
  });
}
