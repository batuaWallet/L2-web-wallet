import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import {
  CssBaseline,
  ThemeProvider,
} from "@material-ui/core";

import { WalletContext } from "./utils/walletContext";
import { TabsBar } from "./components/TabsBar";
import { NewWallet } from "./components/NewWallet";
import { Send } from "./components/Send";
import { BackupSeed } from "./components/BackupSeed";
import { SendParamConfirm } from "./components/SendParamConfirm";

import * as Themes from "./utils/theme";
import { loadSecret, loadWallet } from "./utils/initialize";
 
function App() {
  const [theme, setTheme] = useState(Themes.light);
  const [secret, setSecret] = useState(loadSecret());
  const [wallet, setWallet] = useState(loadWallet());

  useEffect(() => {
    const s = loadSecret();
    if (s) setSecret(s);
  }, [wallet]);

  return (
    <ThemeProvider theme={theme}>
      <WalletContext.Provider value={{wallet, setWallet: (wallet) => setWallet(wallet)}}>
        <CssBaseline />
        { !secret ? <NewWallet /> :
          <Switch>
            <Route exact
              path="/"
              render={() => <TabsBar /> }
            />
            <Route exact
              path="/send"
              render={() => <Send /> }
            />
            <Route exact
              path="/backup"
              render={() => <BackupSeed /> }
            />
            <Route
              path="/send/:address/:amount?"
              render={({ match }) => {
                const add = match.params.address;
                const amt = match.params.amount;
                return <SendParamConfirm address={add} amount={amt} />
              }}
            />
          </Switch>
        }
      </WalletContext.Provider>
    </ThemeProvider>
  );
}

export default App;
