import Biconomy from '@biconomy/mexa';
import WalletConnectProvider from '@maticnetwork/walletconnect-provider';
import { MaticPOSClient } from '@maticnetwork/maticjs';
import * as config from '../config.json';
import ethers from 'ethers';
import { API_KEY } from './constants';

const cache = window.localStorage;

const loadEthProvider = async () => {
  return (
    new WalletConnectProvider({
      host: config.ETHEREUM_RPC,
      callbacks: {
        onConnect: console.log('mainchain connected'),
        onDisconnect: console.log('mainchain disconnected'),
      },
    }));
};

const loadMaticProvider = async () => {
  return (
    new WalletConnectProvider({
      host: config.MATIC_RPC,
      callbacks: {
        onConnect: console.log('matic connected'),
        onDisconnect: console.log('matic disconnected!'),
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
        console.log('Mexa is Ready');
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
  const mClient = await loadMaticClient(w.address);

  return { w, mClient, biconomy };
};
