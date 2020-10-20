import Biconomy from "@biconomy/mexa";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import { MaticPOSClient } from "@maticnetwork/maticjs";
import * as config from "../config.json";
import { Mnemonic } from "@ethersproject/hdnode";
import ethers from "ethers";
import { API_KEY } from "./constants";

const cache = window.localStorage;
let secret: string;

export const loadAddress = () => {
  return "0x";
};

export const saveSecret = (secret: Mnemonic) => {
  if (secret) {
    cache.setItem("magic", JSON.stringify(secret));
  }
};

export const loadSecret = () => {
  if (!secret) {
    const magic = cache.getItem("magic");
    if (magic) {
      let obj = JSON.parse(magic);
      if (obj) {
        secret = obj.phrase;
        return obj.phrase;
      }
    }
  }
  return secret;
};

const loadEthProvider = async () => {
  return (
    new WalletConnectProvider({
      host: config.ETHEREUM_RPC,
      callbacks: {
        onConnect: console.log("mainchain connected"),
        onDisconnect: console.log("mainchain disconnected"),
      },
    }));
};

const loadMaticProvider = async () => {
  return (
    new WalletConnectProvider({
      host: config.MATIC_RPC,
      callbacks: {
        onConnect: console.log("matic connected"),
        onDisconnect: console.log("matic disconnected!"),
      },
    }));
};

export const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  saveSecret(wallet.mnemonic);
  return wallet; 
};

export const loadWallet = (secret? : string | null) => {
  if (secret) {
    return ethers.Wallet.fromMnemonic(secret);
  } else {
    let phrase = loadSecret();
    if (phrase)
      return ethers.Wallet.fromMnemonic(phrase);
  }

  return null;
};

const loadBiconomy = () => {
  const biconomy = new Biconomy(config.MATIC_RPC, { apiKey: API_KEY });
  biconomy
    .onEvent(
      biconomy.READY, () => {
        console.log("Mexa is Ready");
      })
    .onEvent(
      biconomy.ERROR, (error: Error, message: string) => {
        console.log(error, message);
      });
  console.log(biconomy);
  return biconomy;
};

const loadMaticClient = async (address: string) => {
  if (!(address)) { return null; }

  const maticProvider = await loadMaticProvider();
  const ethProvider = await loadEthProvider();

  return (
    new MaticPOSClient({
      network: config.NETWORK,
      version: config.VERSION,
      maticProvider: maticProvider,
      parentProvider: ethProvider,
      parentDefaultOptions: { from: address },
      maticDefaultOptions: { from: address },
    }));
};

export const initialize = async () => {
  const w = loadWallet();
  const biconomy = loadBiconomy();
  let mClient = null;
  if (w)
    mClient = await loadMaticClient(w.address);

  return { w, mClient, biconomy };
};
