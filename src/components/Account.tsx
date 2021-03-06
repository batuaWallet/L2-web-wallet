import React from "react";
import {
  Paper,
  IconButton,
  Typography,
  CardHeader,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import { FileCopy as CopyIcon } from "@material-ui/icons";

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
    marginTop: theme.spacing(2),
  },
  qrcode: {
    height: theme.spacing(7),
    width: theme.spacing(7),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  root: {
    marginBottom: theme.spacing(1),
  },
}));

export const Account = (props: { address: string }) => {

  const theme = useTheme();
  const classes = useStyles();
  const { address } = props;
  const handleCopy = async () => {
    try {
      navigator.clipboard.writeText(address)
    } catch (e) {
      console.log(e);
    }
  }

  if (address && theme) {
    return (
      <>
        <Typography className={classes.root} display="block" gutterBottom={true} variant="h5">
          Account
        </Typography>
        <Paper className={classes.paper}>
          <CardHeader subheader={"WALLET ADDRESS"} /> 
          <Typography variant="caption" gutterBottom={true}> {address} </Typography>
          <QRCode
            value={`ethereum:${address}`}
            className={classes.qrcode}
            fgColor={theme.palette.primary.dark}
          />
          <Typography
            align="center"
            variant="caption"
            gutterBottom={true}
            className={classes.footer}
          >
            Use this unique QR Code to<br></br>receive ₹SA in your Batua wallet
          </Typography>

          <IconButton onClick={handleCopy} color="primary" className={classes.button}>
            <CopyIcon />
          </IconButton>
        </Paper>
      </>
    )
  } else {
    return <Loading />
  }

};
