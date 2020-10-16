import React, { useState } from "react";
import {
  AppBar,
  Tab,
  Tabs,
  makeStyles,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
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
  const [tab, setTab] = useState("Account");

  const updateSelection = (event: React.ChangeEvent<{}>, selectedTab: string) => {
    setTab(selectedTab);
  };

  return (
    <>
      <AppBar position="fixed">
        <Tabs
          value={tab}
          onChange={updateSelection}
          indicatorColor="primar"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Wallet" />
        </Tabs>
        <MenuIcon />
      </AppBar>
    </>
  )
};
