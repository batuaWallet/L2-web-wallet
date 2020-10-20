import React, { useState, useContext } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  SwipeableDrawer,
  makeStyles,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
} from "@material-ui/icons";

const useStyles = makeStyles( theme => ({
  appbarTop: {
    flex: 1,
  },
  menu: {
    marginRight: theme.spacing(2),
  },
}));

export const HamburgerMenu = (props: any) => {
  const classes = useStyles();
  const { setTheme } = props;

  const [open, setOpen] = useState(false);
  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    setOpen(!open);
  };

  return (
    <>
      <AppBar color="inherit" position="fixed" className={classes.appbarTop}>
        <Toolbar>
          <IconButton onClick={toggleDrawer} edge="start" className={classes.menu} color="inherit">
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
      >
        Import Wallet
      </SwipeableDrawer>
    </>
  );
}
