import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Divider,
  Button,
  IconButton,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  ArrowBack as BackIcon,
  ImportContacts as ZapIcon,
} from "@material-ui/icons";
import { WalletContext } from "../utils/walletContext";
import { getRSABalance, getETHBalance, approveForDeposit, depositERC20toMatic }from '../utils/account';
import { lockInCDP } from "../utils/cdpUtils";

const useStyles = makeStyles( theme => ({
  appbar: {
    flex: 1,
  },
  back: {
    marginRight: theme.spacing(2),
  },
  zap: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(10),
    bottom: theme.spacing(2),
  },
}));

export const EnterL2 = (props: any) => {
  const classes = useStyles();
  const wallet = useContext(WalletContext).wallet;

  const [ETHBalance, setETHBalance] = useState(0);
  const [RSABalance, setRSABalance] = useState(0);

  const [bridgeAmount, setBridgeAmount] = useState();
  const [bridgeAmountError, setBridgeAmountError] = useState({err: false, msg: "Amount (₹SA)"});

  const [lockAmount, setLockAmount] = useState();
  const [lockAmountError, setLockAmountError] = useState({err: false, msg: "Amount (ETH)"});

  const [borrowAmount, setBorrowAmount] = useState();
  const [borrowAmountError, setBorrowAmountError] = useState({err: false, msg: "Amount (₹SA)"});

  useEffect(() => {
    (async () => {
      if (wallet) {
        setRSABalance(await getRSABalance(wallet.address));
        setETHBalance(Math.round((await getETHBalance(wallet.address)) * 1000) / 1000);
      }
    })();
  }, [wallet]);

  const handleSwitch = async () => {
    if (wallet) {
      console.log("Depositing to L2");
      const approvalRes = await approveForDeposit(wallet);
      if (approvalRes) {
        const depositRes = depositERC20toMatic(wallet, bridgeAmount);
        console.log(depositRes);
      }
    }
  };

  const handleLock = async () => {
    console.log("Locking Eth in CDP");
    if (wallet){
      const res = await lockInCDP(wallet);
      console.log(res);
    }
  };

  const handleMint = async () => {
    console.log("Minting RSA");
  };

  const handleBridgeAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBridgeAmount(event.target.value);
    let amt = Number(event.target.value);
    if (!amt || amt === 0) {
      setBridgeAmountError({err: true, msg: "Amount must be a non-zero number"});
    } else {
      setBridgeAmountError({err: false, msg: "Amount (₹SA)"});
    }
  };

  const handleLockAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLockAmount(event.target.value);
    let amt = Number(event.target.value);
    if (!amt || amt === 0) {
      setLockAmountError({err: true, msg: "Amount must be a non-zero number"});
    } else {
      setLockAmountError({err: false, msg: "Amount (ETH)"});
    }
  };

  const handleBorrowAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBorrowAmount(event.target.value);
    let amt = Number(event.target.value);
    if (!amt || amt === 0) {
      setBorrowAmountError({err: true, msg: "Amount must be a non-zero number"});
    } else {
      setBorrowAmountError({err: false, msg: "Amount (₹SA)"});
    }
  };

  return (
    <>
      <AppBar color="transparent" position="fixed" className={classes.appbar}>
        <Toolbar>
          <IconButton className={classes.back} component={Link} to={"/"}>
            <BackIcon />
          </IconButton>
          <Typography variant="h6" > Invest with MakerCOW </Typography>
        </Toolbar>
      </AppBar>
      
      <div className={classes.root}>

        <Divider />

        <Typography variant="h6" > Balance: {ETHBalance} ETH </Typography>

        <TextField
          autoFocus={true}
          id="lock-amount-input"
          error={lockAmountError.err}
          value={lockAmount}
          onChange={handleLockAmountChange}
          helperText={lockAmountError.msg}
          variant="outlined"
        />

        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleLock()}
          className={classes.zap}
          startIcon={<ZapIcon />}
        >
          Lock ETH
        </Button>

        <Divider />

        <Typography variant="h6" > Collateral: 0.00 ETH </Typography>
        <Typography variant="h6" > Debt: 0.00 ₹SA </Typography>
        <Typography variant="h6" > Safety Ratio: 0 % </Typography>

        <TextField
          autoFocus={true}
          id="borrow-amount-input"
          error={borrowAmountError.err}
          value={borrowAmount}
          onChange={handleBorrowAmountChange}
          helperText={borrowAmountError.msg}
          variant="outlined"
        />

        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleMint()}
          className={classes.zap}
          startIcon={<ZapIcon />}
        >
          Borrow RSA
        </Button>

        <Divider />

        <Typography variant="h6" > Balance: {RSABalance} ₹SA </Typography>

        <TextField
          autoFocus={true}
          id="bridge-amount-input"
          error={bridgeAmountError.err}
          value={bridgeAmount}
          onChange={handleBridgeAmountChange}
          helperText={bridgeAmountError.msg}
          variant="outlined"
        />

        <Button
          color="primary"
          variant="outlined"
          disabled={bridgeAmountError.err}
          onClick={() => handleSwitch()}
          className={classes.zap}
          startIcon={<ZapIcon />}
        >
          Kaboot-It to L2
        </Button>

      </div>
    </>
  )
};

