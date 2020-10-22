import React from "react";
import { Link } from "react-router-dom";
import {
  Paper,
  CardMedia,
  Typography,
  makeStyles,
  Link as MaterialLink
} from "@material-ui/core";
import {
  Clear as CloseIcon,
} from "@material-ui/icons";

import { MUMBAI_EXPLORER } from "../utils/constants";
import processing from "../assets/processing.png";

const useStyles = makeStyles( theme => ({
  processing: {
    height: theme.spacing(30),
    width: theme.spacing(30),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  root: {
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(8),
    bottom: theme.spacing(3),
  },
  typography: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export const SendConfirm = (props: {txHash: string, amount: string}) => {
  const classes = useStyles();
  const preventDefault = (event: React.SyntheticEvent) => event.preventDefault();
  const { txHash, amount } = props;

  return (
    <Paper>
      <Typography className={classes.typography} variant="h6" gutterBottom={true}>
        Your transaction for {amount} ₹SA is successful!
      </Typography>
      
      <Typography className={classes.typography} gutterBottom={true}>
        <MaterialLink onClick={preventDefault} href={`${MUMBAI_EXPLORER}/tx/${txHash}`}>
            View Transaction
        </MaterialLink>
      </Typography>
      
      <CardMedia image={processing} className={classes.processing} />
    </Paper>
  );
};
