import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import * as config from "./config.json";
import ethers from "ethers";

import {
  loadMaticClient,
  loadMaticProvider,
  loadEthProvider,
  loadWallet,
  loadBiconomy,
} from "./utils/initialize";
import {
  balance,
  send,
}from "./utils/account";

const API_KEY = process.env.REACT_APP_API_KEY ? process.env.REACT_APP_API_KEY : "";

function App() {
  const [provider, setProvider] = useState();
  const [loading, setLoading] = useState(true);
  const [maticProvider, setMaticProvider] = useState();
  const [Networkid, setNetworkid] = useState(config.MATIC_CHAINID);
  const [burnHash, setBurnHash] = useState("");
  const [ethProvider, setEthProvider] = useState();
  const [wallet, setWallet] = useState();
  const [maticClient, setMatiClient] = useState();
  const [INRBalance, setINRBalance] = useState('0');
  const [biconomy, setBiconomy] = useState();

  useEffect(() => {
    (async () => {
      const w = loadWallet();
      const mProvider = loadMaticProvider();
      const eProvider = loadEthProvider();

      setWallet(w);
      setBiconomy(loadBiconomy(mProvider, API_KEY));
      setMaticProvider(mProvider);
      setEthProvider(eProvider);
    })();
  }, []);

  useEffect(() => {
    if (maticProvider && ethProvider && wallet) {
      //console.log(maticProvider, ethProvider, wallet);
      const mClient = loadMaticClient(
        maticProvider,
        ethProvider,
        wallet.address
      );

      setMatiClient(mClient);
    }
  }, [wallet, maticProvider, ethProvider]);

  useEffect(() => {
    (async () => {
      if (maticClient) {
        const bal = await balance(
          wallet.address,
          config.posChildERC20,
          maticClient
        );
        console.log(bal);
        setINRBalance(bal);
      }
    })();
  }, [maticClient]);

  if ( wallet && INRBalance) {
    return (
      <div className="App">
        <header className="App-header">
          <p> Address: {wallet.address} </p>
          <p> magic words: {wallet.mnemonic.phrase} </p>
          <p> balance: ₹{INRBalance} </p>
          <button onClick={() => send(wallet)}> Send ₹ 0.01 </button>
        </header>
      </div>
    );
  } else {
    return <div> Loading </div>
  }
}

export default App;
