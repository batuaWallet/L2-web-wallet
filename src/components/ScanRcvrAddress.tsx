import React, { useState } from "react";
import {
  Paper,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import QrReader from "react-qr-reader";

import { SendParamConfirm } from "./SendParamConfirm";

const useStyles = makeStyles( theme => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  root: {
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
}));

export const ScanRcvrAddress = () => {
  const classes = useStyles();
  const scanner = {
    width: "100%",
  };

  const [address, setAddress] = useState({ err: false, value: "", msg: "" });
  const [forward, setForward] = useState(false);

  const toggleSnackBar = () => { setAddress({...address, err: false}); };
  const handleReject = () => { setForward(false); };
  const handleScan = (data: any) => {
    if (data) {
      const add = data.match(/0x[a-fA-F0-9]{40}/g);
      if (add) {
        setAddress({ err: false, value: add[0], msg: ""});
        setForward(true);
      } else {
        setAddress({...address, err: true, msg: "Scanned input is not an Ethereum address, Please check"})
      }
    }
  };

  if (forward) {
    return <SendParamConfirm address={address.value} reject={handleReject} />
  } else {
    return (
      <Paper className={classes.paper}>
       <QrReader
          delay={100}
          style={scanner}
          onError={(err: Error) => console.log(err)}
          onScan={handleScan}
        />

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={address.err}
          onClose={toggleSnackBar}
          autoHideDuration={10000}
        >
          <Alert onClose={toggleSnackBar} severity="error"> {address.msg} </Alert>
        </Snackbar>
      </Paper>
    );
  }
};

