import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
} from '@material-ui/core';


import { NavBar } from './components/NavBar';
import * as Themes from './utils/theme';
 
function App() {
  const [theme, setTheme] = useState(Themes.dark);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Switch>
          <Route exact
            path="/"
            render={() => {
              return (
                <> Home </>
              );
            }}
          />
            
          <Route exact
            path="/Wallet"
            render={() => {
              return (
                <> Wallet </>
              );
            }}
          />
        </Switch>
      </main>
      <NavBar setTheme={setTheme} />
    </ThemeProvider>
  );
}

export default App;
