import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Paper,
  TextField,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import {
  Check as ConfirmIcon,
  Clear as RejectIcon,
} from "@material-ui/icons";

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

export const AddRcvrAddress = () => {
  const classes = useStyles();

  //const [error, setError] = useState({ err: false, msg: "" });
  const [address, setAddress] = useState({ err: false, value: "", msg: "" });
  const [forward, setForward] = useState(false);

  const handleReject = () => { setForward(false); };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({
      err: false,
      value: event.target.value,
      msg: "",
    });
  };

  const handleAddresConfirm = () => {
    if(!(/^0x[a-fA-F0-9]{40}$/.test(address.value))) {
      console.log("Setting error");
      setAddress({...address, err: true, msg: "invalid"})
    } else {
      setForward(true);
    }
  };

  if (forward) {
    return <SendParamConfirm address={address.value} reject={handleReject} />
  } else {
    return (
      <Paper className={classes.paper}>
        <TextField
          autoFocus={true}
          id="rcvr-address"
          label="Add Wallet Address"
          error={address.err}
          value={address.value}
          onChange={handleChange}
          helperText={address.msg}
          variant="outlined"
        />

        <IconButton onClick={handleAddresConfirm}> <ConfirmIcon /> </IconButton>
        <IconButton component={Link} to={`/send`}> <RejectIcon /> </IconButton>
      </Paper>
    );
  }
};
