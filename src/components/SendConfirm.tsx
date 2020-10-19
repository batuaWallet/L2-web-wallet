import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  Check as ConfirmIcon,
  Clear as RejectIcon,
} from "@material-ui/icons";

import { WalletContext } from "../utils/walletContext";
import { send }from '../utils/account';

const useStyles = makeStyles( theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

export const SendConfirm = (props: {address: string, amount: string}) => {
  const wallet = useContext(WalletContext).wallet;
  const { address, amount} = props;

  const handleSendConfirm = () => {
    
    if (wallet)
      send(wallet, address, amount);
  };

  return (
    <Paper>
      <Typography variant="h4" gutterBottom={true}>
        You are about to send {amount} ₹SA to {address}. Please check and confirm.
      </Typography>
      <IconButton onClick={handleSendConfirm}> <ConfirmIcon /> </IconButton>
      <IconButton component={Link} to={`/`}> <RejectIcon /> </IconButton>
    </Paper>
  );
};
