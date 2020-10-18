import React, { useEffect, useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  Send as SendIcon,
} from "@material-ui/icons";


import { Loading } from "./Loading";
import { initialize } from '../utils/initialize';
import {
  balance,
  send,
}from '../utils/account';

const useStyles = makeStyles( theme => ({
  root: {
    position: "relative",
    minHeight: "534px",
  },
  content: {
    align: "center",
  },
}));

export const Wallet = (props: any) => {

  const classes = useStyles();
  const [wallet, setWallet] = useState();
  const [maticClient, setMatiClient] = useState();
  const [INRBalance, setINRBalance] = useState('0');

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
        setINRBalance(bal);
      }
    })();
  }, [maticClient, wallet]);

  if (wallet && INRBalance) {
    return (
      <>
        <Typography> Wallet </Typography>
        <Card className={classes.root}>
          <CardHeader title={"Current Balance"} /> 
          <CardContent className={classes.content}>
            <Typography> ₹{INRBalance} </Typography>
          </CardContent>
          <CardActions>
            <IconButton onClick={() => send(wallet)}> <SendIcon /> </IconButton>
          </CardActions>
        </Card>
      </>
    );
  } else {
    return <Loading />
  }
};

