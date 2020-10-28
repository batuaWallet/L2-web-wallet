import Biconomy from "@biconomy/mexa";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import { MaticPOSClient } from "@maticnetwork/maticjs";
import * as config from "../config.json";
import { Mnemonic } from "@ethersproject/hdnode";
import { Wallet, providers } from "ethers";
import { API_KEY } from "./constants";

const cache = window.localStorage;
let secret: string;
let maticClient: any;

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
  const provider = new providers.JsonRpcProvider(config.ETHEREUM_RPC);
  /*
  let w = loadWallet()
  if (w) {
    w = w.connect(provider);
    return w;
  }
  */
  return provider;
    /*
  return (
    new WalletConnectProvider({
      host: config.ETHEREUM_RPC,
      callbacks: {
        onConnect: console.log("mainchain connected"),
        onDisconnect: console.log("mainchain disconnected"),
      },
    }));
    */
};

const loadMaticProvider = async () => {
  const provider = new providers.JsonRpcProvider(config.MATIC_RPC);
  /*
  let w = loadWallet()
  if (w) {
    w = w.connect(provider);
    return w;
  }
  */
  return provider;
  /*
  return (
    new WalletConnectProvider({
      host: config.MATIC_RPC,
      callbacks: {
        onConnect: console.log("matic connected"),
        onDisconnect: console.log("matic disconnected!"),
      },
    }));
    */
};

export const createWallet = () => {
  const wallet = Wallet.createRandom();
  saveSecret(wallet.mnemonic);
  return wallet; 
};

export const loadWallet = (secret? : string | null) => {
  if (secret) {
    return Wallet.fromMnemonic(secret);
  } else {
    let phrase = loadSecret();
    if (phrase)
      return Wallet.fromMnemonic(phrase);
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

export const loadMaticClient = async (address: string) => {
  if (maticClient) return maticClient;
  if (!(address)) { return null; }

  const maticProvider = await loadMaticProvider();
  const ethProvider = await loadEthProvider();

  maticClient = new MaticPOSClient({
      network: config.NETWORK,
      version: config.VERSION,
      maticProvider: config.MATIC_RPC,
      parentProvider: config.ETHEREUM_RPC,
      posRootChainManager: config.posRootChainManager,
      parentDefaultOptions: { from: address },
      maticDefaultOptions: { from: address },
    });

  return maticClient;
};

export const initialize = async () => {
  const w = loadWallet();
  const biconomy = loadBiconomy();
  let mClient = null;
  if (w)
    mClient = await loadMaticClient(w.address);

  return { w, mClient, biconomy };
};
