import React, { useContext } from 'react';
import {
  Paper,
  CardMedia,
  IconButton,
  makeStyles,
} from "@material-ui/core";

import brand from "../assets/brand.png";
import { WalletContext } from "../utils/walletContext";
import { AddCircle as CreateIcon } from "@material-ui/icons";
import { createWallet } from "../utils/initialize";

const useStyles = makeStyles( theme => ({
  button: {
    marginTop: theme.spacing(26),
    marginBottom: theme.spacing(3),
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  brand: {
    height: theme.spacing(8),
    width: theme.spacing(18),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export const NewWallet = () => {

  const classes = useStyles();
  const setWallet = useContext(WalletContext).setWallet;
  const handleCreate = () => {
    const w = createWallet();
    console.log(w);

    if (w) {
      setWallet(w);
    }
  };

  return (
    <Paper className={classes.root}>
      <CardMedia image={brand} className={classes.brand} />
      Create New Wallet
      <IconButton onClick={handleCreate} className={classes.button} >
        <CreateIcon />
      </IconButton>
    </Paper>
  );
};
