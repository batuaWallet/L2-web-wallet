import React, { useEffect, useState } from "react";
import {
  Paper,
  IconButton,
  Typography,
  CardHeader,
  makeStyles,
} from "@material-ui/core";
import { Share as ShareIcon } from "@material-ui/icons";

import { Loading } from "./Loading";

const QRCode = require('qrcode.react');

const useStyles = makeStyles( theme => ({
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(2),
  },
  footer: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  qrcode: {
    height: theme.spacing(7),
    width: theme.spacing(7),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  root: {
    marginBottom: theme.spacing(2),
  },
}));

export const Account = (props: { address: string }) => {

  const classes = useStyles();
  const { address } = props;

  if (address) {
    return (
      <>
        <Typography className={classes.root} display="block" gutterBottom={true} variant="h5">
          Account
        </Typography>
        <Paper className={classes.paper}>
          <CardHeader subheader={"Wallet Addresss"} /> 
          <Typography variant="caption" gutterBottom={true}> {address} </Typography>
          <QRCode value={address} className={classes.qrcode} />
          <Typography
            align="center"
            variant="caption"
            gutterBottom={true}
            className={classes.footer}
          >
            Use this unique QR Code to receive ₹SA in your Batua wallet
          </Typography>

          <IconButton className={classes.button}>
            <ShareIcon />
          </IconButton>
        </Paper>
      </>
    )
  } else {
    return <Loading />
  }

};
