import Biconomy from "@biconomy/mexa";
import { MaticPOSClient } from "@maticnetwork/maticjs";
import { Mnemonic } from "@ethersproject/hdnode";
import { Wallet } from "ethers";
import {
  API_KEY,
  ETHEREUM_RPC,
  MATIC_RPC,
  NETWORK,
  VERSION,
  posRootChainManager,
} from "./constants";

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
  const biconomy = new Biconomy(MATIC_RPC, { apiKey: API_KEY });
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

  maticClient = new MaticPOSClient({
      network: NETWORK,
      version: VERSION,
      maticProvider: MATIC_RPC,
      parentProvider: ETHEREUM_RPC,
      posRootChainManager: posRootChainManager,
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
