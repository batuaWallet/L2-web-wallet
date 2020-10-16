import React, { useState } from "react";
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


import { Wallet } from './Wallet';

const useStyles = makeStyles( theme => ({
  appbar: {
    flex: 1,
    bottom: 0,
    top: 'auto',
  },
  appbarTop: {
    flex: 1,
  },
  root: {
    padding: "64px",
  },
  menu: {
    marginRight: theme.spacing(2),
  },
  notification: {
    marginLeft: theme.spacing(2),
  },
}));

export const TabsBar = (props: any) => {
  const classes = useStyles();
  const [tab, setTab] = useState("account");

  const updateSelection = (event: React.ChangeEvent<{}>, selectedTab: string) => {
    setTab(selectedTab);
  };
  console.log(tab)

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

        <TabPanel value="account" className={classes.root}> Account </TabPanel>
        <TabPanel value="menu" className={classes.root}> Menu </TabPanel>
        <TabPanel value="txns" className={classes.root}> Txns </TabPanel>
        <TabPanel value="wallet"> <Wallet /> </TabPanel>

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

