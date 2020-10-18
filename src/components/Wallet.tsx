import React, { useEffect, useState } from 'react';
import {
  Paper,
  CardMedia,
  CardHeader,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  Send as SendIcon,
} from "@material-ui/icons";

import logo from "../assets/logo.png";
import { Loading } from "./Loading";
import { initialize } from '../utils/initialize';
import {
  balance,
  send,
}from '../utils/account';

const useStyles = makeStyles( theme => ({
  button: {
    marginTop: theme.spacing(26),
    marginBottom: theme.spacing(3),
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(2),
  },
  logo: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
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

  if (wallet && INRBalance) {
    return (
      <>
        <Typography className={classes.root} display="block" gutterBottom={true} variant="h5"> Wallet </Typography>
        <Paper>
          <div className={classes.card}>
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
              <IconButton className={classes.button} onClick={() => send(wallet)}> <SendIcon /> </IconButton>
          </div>
        </Paper>
      </>
    );
  } else {
    return <Loading />
  }
};
