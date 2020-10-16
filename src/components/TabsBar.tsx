import React, { useState, useContext } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
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
    marginRight: theme.spacing(65),
  },
  notification: {
    marginLeft: theme.spacing(65),
  },
}));

export const TabsBar = (props: any) => {
  const classes = useStyles();
  console.log(classes.menu);
  console.log(classes.notification);
  const [tab, setTab] = useState("account");

  const updateSelection = (event: React.ChangeEvent<{}>, selectedTab: string) => {
    setTab(selectedTab);
  };
  console.log(tab)

  const wallet = useContext(WalletContext).wallet;

  return (
    <>
      <TabContext value={tab}>
        <AppBar position="fixed" className={classes.appbarTop}>
          <Tabs
            value={tab}
            onChange={updateSelection}
            indicatorColor="secondary"
            textColor="secondary"
            variant="fullWidth"
          >
            <Tab className={classes.menu} value="menu" icon={<MenuIcon />} aria-label="menu" />
          </Tabs>
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
    </>
  )
};

