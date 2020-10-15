import React, { useEffect, useState } from 'react';
import './App.css';

import * as config from "./config.json";

import { initialize, } from "./utils/initialize";
import {
  balance,
  send,
}from "./utils/account";

function App() {
  const [wallet, setWallet] = useState();
  const [maticClient, setMatiClient] = useState();
  const [INRBalance, setINRBalance] = useState('0');
  const [biconomy, setBiconomy] = useState();

  useEffect(() => {
    (async () => {
      const [w, mClient, biconomy] = await initialize();
      setWallet(w);
      setMatiClient(mClient);
      setBiconomy(biconomy);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (maticClient && wallet) {
        const bal = await balance(
          wallet.address,
          config.posChildERC20,
          maticClient
        );
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
