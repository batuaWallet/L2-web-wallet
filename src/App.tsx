import React, { useState } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import {
  CssBaseline,
  ThemeProvider,
} from "@material-ui/core";

import { WalletContext } from "./utils/walletContext";
import { TabsBar } from "./components/TabsBar";
import { NewWallet } from "./components/NewWallet";
import { Send } from './components/Send';

import * as Themes from "./utils/theme";
import { loadSecret, loadWallet } from "./utils/initialize";
 
function App() {
  const [theme, setTheme] = useState(Themes.dark);
  const [secret, setSecret] = useState(loadSecret());
  const [wallet, setWallet] = useState(loadWallet());

  return (
    <ThemeProvider theme={theme}>
      <WalletContext.Provider value={{wallet, setWallet: () => setWallet}}>
        <CssBaseline />
        <Switch>
          <Route exact
            path="/"
            render={() => {
              if (secret) return <TabsBar />
              return <NewWallet />
            }}
          />
          <Route exact
            path="/send"
            render={() => {
              if (secret) return <Send />
              return <NewWallet />
            }}
          />
        </Switch>
      </WalletContext.Provider>
    </ThemeProvider>
  );
}

export default App;
