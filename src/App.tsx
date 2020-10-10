import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import * as Matic from "@maticnetwork/maticjs";
import { Network } from "@maticnetwork/meta/network";
import * as config from "./config.json";
import ethers from "ethers";

const cache = window.localStorage;
const MaticPoSClient = Matic.MaticPOSClient;
const w = window as any;

function App() {
  const [loading, setLoading] = useState(true);
  const [maticProvider, setMaticProvider] = useState();
  const [Networkid, setNetworkid] = useState(config.MATIC_CHAINID);
  const [burnHash, setBurnHash] = useState("");
  const [ethereumProvider, setEthereumProvider] = useState();
  const [wallet, setWallet] = useState();
  const [maticClient, setMatiClient] = useState();

  useEffect(() => {
    console.log(wallet);
  }, [wallet]);

  const loadWallet = async () => {
    const magicWords = cache.getItem('magicWords');
    if (magicWords) {
      setWallet(ethers.Wallet.fromMnemonic(JSON.parse(magicWords).phrase)); 
    } else {
      const w = ethers.Wallet.createRandom();
      cache.setItem('magicWords', JSON.stringify(w.mnemonic));
      setWallet(w); 
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    const mProvider = new WalletConnectProvider({
      host: config.MATIC_RPC,
      callbacks: {
        onConnect: console.log("matic connected"),
        onDisconnect: console.log("matic disconnected!"),
      },
    });

    const eProvider = new WalletConnectProvider({
      host: config.ETHEREUM_RPC,
      callbacks: {
        onConnect: console.log("mainchain connected"),
        onDisconnect: console.log("mainchain disconnected"),
      },
    });

    setMaticProvider(mProvider);
    setEthereumProvider(eProvider);

  };

  useEffect(() => {
    loadWallet();
    loadBlockchainData();
  }, []);

  useEffect(() => {
    ( async () => {
      if ( wallet && maticProvider && ethereumProvider ) {
        const mClient = new MaticPoSClient({
          network: config.NETWORK,
          version: config.VERSION,
          maticProvider: maticProvider,
          parentProvider: ethereumProvider,
          parentDefaultOptions: { from: wallet.address },
          maticDefaultOptions: { from: wallet.address },
        });

        if (mClient) {
          setMatiClient(mClient);
          console.log(await mClient.balanceOfERC20(
            wallet.address,
            config.posChildERC20,
            {}
          ));
        }
      }
    })();
  }, [wallet, maticProvider, ethereumProvider]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
