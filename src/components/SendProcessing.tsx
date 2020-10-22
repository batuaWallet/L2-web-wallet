import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  CardMedia,
  Typography,
  makeStyles,
} from "@material-ui/core"

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
    alignItems: "center",
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(2),
  },
  typography: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export const SendProcessing = (props: {amount: string}) => {
  const classes = useStyles();
  const { amount } = props;

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" align="center">
        Your transaction for ${amount} ₹SA is being processed...
      </Typography>
      <CardMedia image={processing} className={classes.processing} />
    </Paper>
  );
}
