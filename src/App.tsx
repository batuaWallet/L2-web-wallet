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
import { Send } from "./components/Send";
import { SendAmount } from "./components/SendAmount";

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
        { !secret ? <NewWallet /> :
          <Switch>
            <Route exact
              path="/"
              render={() => <TabsBar />}
            />
            <Route exact
              path="/send"
              render={() => <Send />}
            />
            <Route
              path="/send/:address/:amount"
              render={({ match }) => {
                const add = match.params.address;
                const amt = match.params.amount;
                console.log(add,amt);
                return <SendAmount address={add} />
              }}
            />
          </Switch>
        }
      </WalletContext.Provider>
    </ThemeProvider>
  );
}

export default App;
