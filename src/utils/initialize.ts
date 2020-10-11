import Biconomy from "@biconomy/mexa";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import Matic from "@maticnetwork/maticjs";
import { Network } from "@maticnetwork/meta/network";
import * as config from "../config.json";
import ethers from "ethers";

console.log(Matic);
const MaticPoSClient = Matic.MaticPOSClient;
const cache = window.localStorage;

export const loadBiconomy = async (maticProvider: any, apiKey: string) => {
  return Biconomy( maticProvider, { apiKey })
};

export const loadEthProvider = async () => {
  return (
    new WalletConnectProvider({
      host: config.ETHEREUM_RPC,
      callbacks: {
        onConnect: console.log("mainchain connected"),
        onDisconnect: console.log("mainchain disconnected"),
      },
    }))
};

export const loadMaticClient = (maticProvider: any, ethProvider: any, address: string) => {
  return (
    new MaticPoSClient({
      network: config.NETWORK,
      version: config.VERSION,
      maticProvider: maticProvider,
      parentProvider: ethProvider,
      parentDefaultOptions: { from: address },
      maticDefaultOptions: { from: address },
    }))
};

export const loadMaticProvider = async () => {
  return (
    new WalletConnectProvider({
      host: config.MATIC_RPC,
      callbacks: {
        onConnect: console.log("matic connected"),
        onDisconnect: console.log("matic disconnected!"),
      },
    }))
}

export const loadWallet = () => {
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
