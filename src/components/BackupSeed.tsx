import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Paper,
  IconButton,
  Typography,
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

export const BackupSeed = (props: any) => {
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
      <Paper>
        <Typography> Your Secreet Key </Typography>
      </Paper>
    </>
  )
};
