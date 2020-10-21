import React, { useContext } from 'react';
import {
  Paper,
  CardMedia,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";

import brand from "../assets/brand.png";
import onboarding from "../assets/onboarding.png";
import { WalletContext } from "../utils/walletContext";
import { AddCircle as CreateIcon } from "@material-ui/icons";
import { createWallet } from "../utils/initialize";

const useStyles = makeStyles( theme => ({
  typography: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
  onboarding: {
    height: theme.spacing(30),
    width: theme.spacing(30),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  brand: {
    height: theme.spacing(4),
    width: theme.spacing(8),
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
      <CardMedia image={onboarding} className={classes.onboarding} />
      <Typography variant="h6" align="center">
        Digital payment through ₹SA
      </Typography>
      <Typography variant="caption" align="center">
        The Indian Crypto Currency
      </Typography>
      <Typography className={classes.typography} variant="caption" align="center">
        Batua provides you a safe and secure wallet for easy
        and hassle-free digital payments through the ₹SA
      </Typography>
      <IconButton onClick={handleCreate} className={classes.button} >
        <CreateIcon />
      </IconButton>
    </Paper>
  );
};
