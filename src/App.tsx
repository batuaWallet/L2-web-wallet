import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Biconomy from "@biconomy/mexa";
import WalletConnectProvider from "@maticnetwork/walletconnect-provider";
import * as Matic from "@maticnetwork/maticjs";
import { Network } from "@maticnetwork/meta/network";
import * as config from "./config.json";
import ethers from "ethers";

const cache = window.localStorage;
const MaticPoSClient = Matic.MaticPOSClient;
const w = window as any;

function App() {
  const [provider, setProvider] = useState();
  const [loading, setLoading] = useState(true);
  const [maticProvider, setMaticProvider] = useState();
  const [Networkid, setNetworkid] = useState(config.MATIC_CHAINID);
  const [burnHash, setBurnHash] = useState("");
  const [ethereumProvider, setEthereumProvider] = useState();
  const [wallet, setWallet] = useState();
  const [maticClient, setMatiClient] = useState();
  const [INRBalance, setINRBalance] = useState('0');
  const [signer, setSigner] = useState();

  useEffect(() => {
    console.log(wallet);
  }, [wallet]);

  const loadWallet = async () => {
    let magicWords = cache.getItem('magicWords');
    let w;
    if (magicWords) {
      w = ethers.Wallet.fromMnemonic(JSON.parse(magicWords).phrase);
    } else {
      w = ethers.Wallet.createRandom();
      magicWords = JSON.stringify(w.mnemonic);
      cache.setItem('magicWords', magicWords);
    }
    setWallet(w); 
    const sig = new ethers.Wallet(w._signingKey().privateKey );
    setSigner(sig);
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

  const send = async () => {
    if (signer) {
      console.log("Sending");
      let txParams = {
        "from": wallet.address,
        "gasLimit": ethers.utils.hexlify(210000),
        "to": "0x0B510F42fF8497254B006C2Ae9c85B3F831f052E",
        "value": ethers.utils.parseEther("0.01"),
      };
      const receipt = await signer.sendTransaction(txParams);
      console.log(receipt);
      /*/let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, txHash)=>{
        if(error) {
            return console.error(error);
        }
        console.log(txHash);
      });
      */

    } else {
      window.alert("Wallet is Loading");
    }


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
          const balance = ethers.utils.formatUnits(
            await mClient.balanceOfERC20(
              wallet.address,
              config.posChildERC20,
              {}
            ));
          console.log(balance);
          setINRBalance(balance);
        }
      }
    })();
  }, [wallet, maticProvider, ethereumProvider]);

  useEffect(() => {
    if (maticProvider) {
      console.log(process.env.REACT_APP_API_KEY);
      const biconomy = new Biconomy(maticProvider,{apiKey: process.env.REACT_APP_API_KEY});
      console.log(biconomy);
      //setProvider(biconomy);
    }
  }, [maticProvider]);

  if ( wallet && maticProvider && ethereumProvider ) {
    return (
      <div className="App">
        <header className="App-header">
          <p> Address: {wallet.address} </p>
          <p> magic words: {wallet.mnemonic.phrase} </p>
          <p> balance: ₹{INRBalance} </p>
          <button onClick={() => send()}> Send ₹ 0.01 </button>
        </header>
      </div>
    );
  } else {
    return <div> Loading </div>
  }
}

export default App;
