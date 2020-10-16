import React, { useEffect, useState } from 'react';

import { Loading } from "./Loading";
import { initialize } from '../utils/initialize';
import {
  balance,
  send,
}from '../utils/account';


export const Wallet = (props: any) => {
  const [wallet, setWallet] = useState();
  const [maticClient, setMatiClient] = useState();
  const [INRBalance, setINRBalance] = useState('0');

  useEffect(() => {
    (async () => {
      const { w, mClient } = await initialize();
      setWallet(w);
      setMatiClient(mClient);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (maticClient && wallet) {
        const bal = await balance(
          wallet.address,
          maticClient
        );
        setINRBalance(bal);
      }
    })();
  }, [maticClient, wallet]);

  if (wallet && INRBalance) {
    return (
      <div className='App'>
        <header className='App-header'>
          <p> Address: {wallet.address} </p>
          <p> magic words: {wallet.mnemonic.phrase} </p>
          <p> balance: ₹{INRBalance} </p>
          <button onClick={() => send(wallet)}> Send ₹ 0.01 </button>
        </header>
      </div>
    );
  } else {
    return <Loading />
  }
};

