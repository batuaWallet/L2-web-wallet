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
  Clear as CloseIcon,
} from "@material-ui/icons";

import { MUMBAI_EXPLORER } from "../utils/constants";
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

export const SendConfirm = (props: {txHash: string, amount: string}) => {
  const { txHash, amount } = props;

  return (
    <>
      <IconButton component={Link} to={`/`}> <CloseIcon /> </IconButton>

      <Typography variant="h6" gutterBottom={true}>
        Your transaction for {amount} ₹SA is successful!
      </Typography>
      
      <Typography gutterBottom={true}>
         <a href={`${MUMBAI_EXPLORER}/tx/${txHash}`}>View Transaction</a>
      </Typography>
      
    </>
  );
};
