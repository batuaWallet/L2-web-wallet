import React, { useState, useContext } from "react";
import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  AccountBalanceWallet as WalletIcon,
  AccountCircle as AccountIcon,
  Receipt as TransactionIcon,
} from "@material-ui/icons";
import { TabContext, TabPanel } from "@material-ui/lab";

import { WalletContext } from "../utils/walletContext";
import { Wallet } from './Wallet';
import { Account } from './Account';

const useStyles = makeStyles( theme => ({
  appbar: {
    flex: 1,
    bottom: 0,
    top: 'auto',
  },
  appbarTop: {
    flex: 1,
  },
  panel: {
    marginTop: theme.spacing(8),
  },
  menu: {
    marginRight: theme.spacing(2),
  },
}));

export const TabsBar = (props: any) => {
  const classes = useStyles();
  const [tab, setTab] = useState("wallet");

  const updateSelection = (event: React.ChangeEvent<{}>, selectedTab: string) => {
    setTab(selectedTab);
  };

  const wallet = useContext(WalletContext).wallet;

  return (
    <TabContext value={tab}>
      <AppBar position="fixed" className={classes.appbarTop}>
        <Toolbar>
          <IconButton edge="start" className={classes.menu} color="inherit">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <TabPanel value="account" className={classes.panel}>
        <Account address={wallet ? wallet.address: ""} />
      </TabPanel>
      <TabPanel value="menu" className={classes.panel}> Menu </TabPanel>
      <TabPanel value="txns" className={classes.panel}> Txns </TabPanel>
      <TabPanel value="wallet" className={classes.panel}> <Wallet /> </TabPanel>

      <AppBar position="fixed" className={classes.appbar}>
        <Tabs
          value={tab}
          onChange={updateSelection}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab value="wallet" icon={<WalletIcon />} aria-label="wallet" />
          <Tab value="account" icon={<AccountIcon />} aria-label="account" />
          <Tab value="txns" icon={<TransactionIcon />} aria-label="txns" />

        </Tabs>
      </AppBar>
    </TabContext>
  )
};

