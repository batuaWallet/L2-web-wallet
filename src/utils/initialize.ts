import Biconomy from "@biconomy/mexa";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import { MaticPOSClient } from "@maticnetwork/maticjs";
import * as config from "../config.json";
import ethers from "ethers";

const API_KEY = process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "";
const cache = window.localStorage;

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

const loadWallet = () => {
  const magic = cache.getItem('magic');
  if (magic) {
    let obj = JSON.parse(magic);
    if (obj) {
      return ethers.Wallet.fromMnemonic(obj.phrase);
    }
  }

  const w = ethers.Wallet.createRandom();
  cache.setItem('magic', JSON.stringify(w.mnemonic));
  return w; 
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

const loadBiconomyProvider = (biconomy: any) => {
  return new ethers.providers.Web3Provider(biconomy);
};

const loadMaticClient = (address: string, maticProvider: any, ethProvider: any) => {
  if (!(address && maticProvider && ethProvider)) { return null; }

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
  const mProvider = await loadMaticProvider();
  const eProvier = await loadEthProvider();

  const mClient = loadMaticClient(w.address, mProvider, eProvier);
  const biconomy = loadBiconomy();
  const biconomyProvider = loadBiconomyProvider(biconomy);

  return [w, mClient, biconomy, w.connect(biconomyProvider)];
};
