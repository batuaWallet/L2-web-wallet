import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  ArrowBack as BackIcon,
  CropFree as ScanIcon,
  ImportContacts as ContactsIcon,
} from "@material-ui/icons";
import { AddRcvrAddress } from "./AddRcvrAddress";
import { ScanRcvrAddress } from "./ScanRcvrAddress";

const useStyles = makeStyles( theme => ({
  appbar: {
    flex: 1,
  },
  back: {
    marginRight: theme.spacing(2),
  },
  qrCode: {
    marginTop: theme.spacing(8),
  },
  contacts: {
    marginTop: theme.spacing(8),
  },
  root: {
    display: "flex",
    justifyContent: "center",
  },
}));

export const Send = (props: any) => {
  const classes = useStyles();
  const [addressOpt, setAddressOpt] = useState("qrcode");

  return (
    <>
      <AppBar color="transparent" position="fixed" className={classes.appbar}>
        <Toolbar>
          <IconButton className={classes.back} component={Link} to={"/"}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" > Send ₹SA </Typography>
        </Toolbar>
      </AppBar>
      

      <div className={classes.root}>
        <IconButton color="primary" onClick={() => setAddressOpt("qrcode")} className={classes.qrCode}>
          <ScanIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => setAddressOpt("contacts")} className={classes.contacts}>
          <ContactsIcon />
        </IconButton>
      </div>
      { addressOpt === "qrcode"
        ?<ScanRcvrAddress />
        : <AddRcvrAddress />
      }
    </>
  )
};
