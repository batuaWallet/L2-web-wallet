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

const useStyles = makeStyles( theme => ({
  appbar: {
    flex: 1,
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
  const [tab, setTab] = useState(1);

  const updateSelection = (event: React.ChangeEvent<{}>, selectedTab: number) => {
    setTab(selectedTab);
  };
  console.log(tab)

  return (
    <>
      <AppBar position="fixed">
        <Tabs
          value={tab}
          onChange={updateSelection}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab icon={<WalletIcon />} aria-label="wallet" />
          <Tab icon={<AccountIcon />} aria-label="Account" />
          <Tab icon={<TransactionIcon />} aria-label="Txns" />
        </Tabs>
      </AppBar>
    </>
  )
};
