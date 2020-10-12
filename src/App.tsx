import React, { useEffect, useState } from 'react';
import './App.css';

import * as config from "./config.json";

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
  const [maticProvider, setMaticProvider] = useState();
  const [ethProvider, setEthProvider] = useState();
  const [wallet, setWallet] = useState();
  const [maticClient, setMatiClient] = useState();
  const [INRBalance, setINRBalance] = useState('0');
  const [biconomy, setBiconomy] = useState();

  useEffect(() => {
    console.log("Effect 1");
    (async () => {
      console.log("Loading and Setting Wallet");
      setWallet(loadWallet());

      console.log("Loading and Setting M provider");
      setMaticProvider(loadMaticProvider);

      console.log("Loading and Setting E provider");
      setEthProvider(loadEthProvider());
    })();
  }, []);

  useEffect(() => {
    console.log("Effect 2");
    (async () => {
      console.log("Loading and Setting Biconomy");
      setBiconomy(loadBiconomy(maticProvider, API_KEY));
    })();
  }, [maticProvider]);

  useEffect(() => {
    console.log("Effect 3");
    console.log("Loading and Setting M Client");
    if (maticProvider && ethProvider && wallet) {
      setMatiClient(loadMaticClient(
        maticProvider,
        ethProvider,
        wallet.address
      ));
    }
  }, [wallet, maticProvider, ethProvider]);

  useEffect(() => {
    console.log("Effect 4");
    (async () => {
      if (maticClient && wallet) {
        const bal = await balance(
          wallet.address,
          config.posChildERC20,
          maticClient
        );
        console.log(bal);
        setINRBalance(bal);
      }
    })();
  }, [maticClient, wallet]);

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
