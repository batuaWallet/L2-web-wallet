import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
} from '@material-ui/core';

import { TabsBar } from './components/TabsBar';
import { NewWallet } from './components/NewWallet';

import * as Themes from './utils/theme';
import { loadSecret, loadAddress, loadWallet } from "./utils/initialize";

 
function App() {
  const [theme, setTheme] = useState(Themes.dark);
  const [secret, setSecret] = useState(loadSecret());
  const [wallet, setWallet] = useState(loadWallet());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      { secret
        ? <TabsBar secret={secret} />
        : <NewWallet />
      }
    </ThemeProvider>
  );
}

export default App;
