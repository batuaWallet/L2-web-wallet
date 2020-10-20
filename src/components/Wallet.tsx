import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {
  Paper,
  CardMedia,
  CardHeader,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";

import logo from "../assets/logo.png";
import { initialize } from '../utils/initialize';
import { balance }from '../utils/account';

const useStyles = makeStyles( theme => ({
  button: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(3),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(2),
  },
  logo: {
    height: theme.spacing(7),
    width: theme.spacing(7),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  root: {
    marginBottom: theme.spacing(2),
  },
}));

export const Wallet = (props: any) => {

  const classes = useStyles();
  const [wallet, setWallet] = useState();
  const [maticClient, setMatiClient] = useState();
  const [INRBalance, setINRBalance] = useState(0);
  const [RSABalance, setRSABalance] = useState(0);

  useEffect(() => {
    (async () => {
      const { w, mClient } = await initialize();
      setWallet(w);
      setMatiClient(mClient);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (maticClient && wallet) {
        const bal = await balance(
          wallet.address,
          maticClient
        );
        setINRBalance(Number((bal * 1.01).toFixed(2)));
        setRSABalance(bal);
      }
    })();
  }, [maticClient, wallet]);

  return (
    <>
      <Typography className={classes.root} display="block" gutterBottom={true} variant="h5">
        Wallet
      </Typography>
      <Paper className={classes.paper}>
        <CardHeader subheader={"Current Balance"} /> 
        <CardMedia image={logo} className={classes.logo} />
        <Typography variant="h4" gutterBottom={true}> {RSABalance}&nbsp;₹SA </Typography>
        <Typography
          align="center"
          display="block"
          variant="caption"
          color="textSecondary"
        >
          {INRBalance}&nbsp;₹
        </Typography>
        <IconButton
          className={classes.button}
          component={Link}
          to={"/send"}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </>
  );
};
