import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
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
  },
  panel: {
    marginTop: theme.spacing(8),
  },
  qrCode: {
    marginRight: theme.spacing(65),
  },
  contacts: {
    marginLeft: theme.spacing(65),
  },
}));

export const Send = (props: any) => {
  const classes = useStyles();
  const [addressOpt, setAddressOpt] = useState("contacts");

  const updateSelection = (event: React.ChangeEvent<{}>, selectedTab: string) => {
    setAddressOpt(selectedTab);
  };

  return (
    <TabContext value={addressOpt}>
      <AppBar position="fixed" className={classes.appbar}>
        <Tabs
          value={addressOpt}
          onChange={updateSelection}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab value="back" icon={<BackIcon />} component={Link} to={"/"} />
          <Tab value="qrCode" icon={<ScanIcon />} />
          <Tab value="contacts" icon={<ContactsIcon />} />
        </Tabs>
      </AppBar>
      <TabPanel value="qrCode" className={classes.panel}>
        <ScanRcvrAddress />
      </TabPanel>
      <TabPanel value="contacts" className={classes.panel}>
        <AddRcvrAddress />
      </TabPanel>
    </TabContext>
  )
};
