import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  CardContent,
  makeStyles,
} from "@material-ui/core";

import { Loading } from "./Loading";

const QRCode = require('qrcode.react');

const useStyles = makeStyles( theme => ({
  root: {
    position: "relative",
    minWidth: "308px",
    minHeight: "534px",
  },
  content: {
    display: "flex",
    align: "center",
  },
}));

export const Account = (props: { address: string }) => {

  const classes = useStyles();
  const { address } = props;

  if (address) {
    return (
      <Card raised={true} className={classes.root}>
        <CardContent>
          <Typography> {address} </Typography>
          <QRCode value={address} />
        </CardContent>
      </Card>
    )
  } else {
    return <Loading />
  }

};
