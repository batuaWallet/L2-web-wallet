import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Paper,
  Typography,
  IconButton,
  makeStyles,
} from "@material-ui/core";
import {
  Check as ConfirmIcon,
  Clear as RejectIcon,
} from "@material-ui/icons";
import blockies from "ethereum-blockies"

const useStyles = makeStyles( theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export const SendParamConfirm = (props: {address: string, reject: () => void}) => {
  const classes = useStyles();
  const { address, reject } = props;

  if (address) {
    return (
      <Paper>
        <div className={classes.root}>
          <Avatar
            alt={address}
            className={classes.avatar}
            src={blockies.create({
              seed: address,
            }).toDataURL()}
          />
          <Typography variant="caption" gutterBottom={true}> {address} </Typography>
          <IconButton component={Link} to={`/send/${address}`}> <ConfirmIcon /> </IconButton>
          <IconButton onClick={reject}> <RejectIcon /> </IconButton>
        </div>
      </Paper>
    );
  } else return <div> Loading </div>
};
