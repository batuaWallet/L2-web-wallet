import React, { useEffect, useState } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import {
  CssBaseline,
  ThemeProvider,
} from '@material-ui/core';


import { TabsBar } from './components/TabsBar';
import * as Themes from './utils/theme';
 
function App() {
  const [theme, setTheme] = useState(Themes.dark);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TabsBar setTheme={setTheme} />
    </ThemeProvider>
  );
}

export default App;
