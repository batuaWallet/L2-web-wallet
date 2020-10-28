import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  ArrowBack as BackIcon,
  CropFree as ScanIcon,
  ImportContacts as ZapIcon,
} from "@material-ui/icons";
import { AddRcvrAddress } from "./AddRcvrAddress";
import { ScanRcvrAddress } from "./ScanRcvrAddress";
import { loadMaticClient } from '../utils/initialize';
import { WalletContext } from "../utils/walletContext";
import { getRSABalance, approveForDeposit, }from '../utils/account';

const useStyles = makeStyles( theme => ({
  appbar: {
    flex: 1,
  },
  back: {
    marginRight: theme.spacing(2),
  },
  zap: {
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(1),
  },
  root: {
    display: "flex",
    justifyContent: "center",
  },
}));

export const EnterL2 = (props: any) => {
  const classes = useStyles();
  const wallet = useContext(WalletContext).wallet;

  const [RSABalance, setRSABalance] = useState(0);
  const [maticClient, setMatiClient] = useState();

  const handleSwitch = async () => {
    if (wallet) {
      console.log("Depositing to L2");
      console.log(maticClient);
      const approvalRes = approveForDeposit(wallet);
    }

  };

  useEffect(() => {
    (async () => {
      if (wallet) {
        const mClient = await loadMaticClient(wallet.address);
        setMatiClient(mClient);
        console.log(mClient)
      }
    })();
  }, [wallet]);

  useEffect(() => {
    (async () => {
      if (wallet) {
        const bal = await getRSABalance(wallet.address);
        console.log(bal)
        setRSABalance(bal);
      }
    })();
  }, [wallet]);

  return (
    <>
      <AppBar color="transparent" position="fixed" className={classes.appbar}>
        <Toolbar>
          <IconButton className={classes.back} component={Link} to={"/"}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" > Invest in MakerCOW </Typography>
        </Toolbar>
      </AppBar>
      

      <div className={classes.root}>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleSwitch()}
          className={classes.zap}
          startIcon={<ZapIcon />}
        >
          Switch to L2
        </Button>
      </div>
      <p> Balance: {RSABalance} </p>
    </>
  )
};

