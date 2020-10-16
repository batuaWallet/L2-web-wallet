import React, { useState } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
  AccountBalanceWallet as WalletIcon,
  AccountCircle as AccountIcon,
  Receipt as TransactionIcon,
} from "@material-ui/icons";
import { TabContext, TabPanel } from "@material-ui/lab";


import { Wallet } from './Wallet';

const useStyles = makeStyles( theme => ({
  appbar: {
    flex: 1,
    bottom: 0,
    top: 'auto',
  },
  wallet: {
    marginRight: theme.spacing(2),
  },
  tx: {
    marginLeft: theme.spacing(2),
  },
}));

export const NavBar = (props: any) => {
  const classes = useStyles();
  const [tab, setTab] = useState("account");

  const updateSelection = (event: React.ChangeEvent<{}>, selectedTab: string) => {
    setTab(selectedTab);
  };
  console.log(tab)

  return (
    <>
      <TabContext value={tab}>
        <TabPanel value="wallet"> <Wallet /> </TabPanel>
        <TabPanel value="account"> Account </TabPanel>
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
