import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  IconButton,
  Tab,
  Tabs,
  makeStyles,
} from "@material-ui/core";
import { TabContext, TabPanel } from "@material-ui/lab";
import {
  ArrowBackIos as BackIcon,
  CropFree as ScanIcon,
  ImportContacts as ContactsIcon,
} from "@material-ui/icons";
import { AddRcvrAddress } from "./AddRcvrAddress";
import { ScanRcvrAddress } from "./ScanRcvrAddress";

const useStyles = makeStyles( theme => ({
  appbar: {
    flex: 1,
    bottom: 0,
    top: 'auto',
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
  const [addressOpt, setAddressOpt] = useState("contacts");

  const updateSelection = (event: React.ChangeEvent<{}>, selectedTab: string) => {
    setAddressOpt(selectedTab);
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appbar}>
          <IconButton className={classes.back} component={Link} to={"/"}>
            <BackIcon />
          </IconButton>
      </AppBar>
      <div className={classes.root}>
        <IconButton color="secondary" onClick={() => setAddressOpt("qrcode")} className={classes.qrCode}>
          <ScanIcon />
        </IconButton>
        <IconButton color="secondary" onClick={() => setAddressOpt("contacts")} className={classes.contacts}>
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
