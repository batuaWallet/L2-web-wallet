import React from 'react';
import { Wallet } from "ethers";

export const WalletContext = React.createContext({
  wallet: {} as Wallet | null,
  setWallet: () => {},
});

