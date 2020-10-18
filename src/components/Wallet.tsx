import React, { useEffect, useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
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

const assetsPath = "../assets";

const useStyles = makeStyles( theme => ({
  root: {
    position: "relative",
    minHeight: "534px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  content: {
    align: "center",
  },
  logo: {
    height: 48,
    width: 48,
    marginTop: 28,
    marginBottom: 28,
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
        <Typography display="block" gutterBottom={true} variant="h5"> Wallet </Typography>
        <Card className={classes.root}>
          <div className={classes.card}>
            <CardHeader subheader={"Current Balance"} /> 
            <CardMedia image={logo} className={classes.logo} />
            <CardContent className={classes.content}>
              <Typography variant="h4"> {RSABalance}&nbsp;₹SA </Typography>
              <Typography
                align="center"
                display="block"
                variant="caption"
                color="textSecondary"
                gutterBottom={true}
              >
                {INRBalance}&nbsp;₹
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton onClick={() => send(wallet)}> <SendIcon /> </IconButton>
            </CardActions>
          </div>
        </Card>
      </>
    );
  } else {
    return <Loading />
  }
};
