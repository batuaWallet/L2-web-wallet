import { AddressZero } from "@ethersproject/constants";
import { formatEther } from "@ethersproject/units";
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
  Lock as LockIcon,
  GetApp as BorrowIcon,
  SwapHoriz as BridgeIcon,
} from "@material-ui/icons";
import { WalletContext } from "../utils/walletContext";
import { getRSABalance, getETHBalance, approveForDeposit, depositERC20toMatic }from '../utils/account';
import { getCDP, lockInCDP, mintRSA } from "../utils/cdpUtils";

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

  const [collateral, setCollateral] = useState(0);
  const [debt, setDebt] = useState(0);
  const [credit, setCredit] = useState(0);

  const [bridgeAmount, setBridgeAmount] = useState("");
  const [bridgeAmountError, setBridgeAmountError] = useState({err: false, msg: "Amount (₹SA)"});

  const [lockAmount, setLockAmount] = useState("");
  const [lockAmountError, setLockAmountError] = useState({err: false, msg: "Amount (ETH)"});

  const [borrowAmount, setBorrowAmount] = useState("");
  const [borrowAmountError, setBorrowAmountError] = useState({err: false, msg: "Amount (₹SA)"});

  useEffect(() => {
    (async () => {
      if (wallet) {
        setRSABalance(await getRSABalance(wallet.address));
        setETHBalance(Math.round((await getETHBalance(wallet.address)) * 1000) / 1000);
        const cdp = await getCDP(wallet.address);
        if (cdp.lad === AddressZero) {
          setCollateral(0);
          setDebt(0);
        }
        setCollateral(parseFloat(formatEther(cdp.ink)));
        setDebt(parseFloat(formatEther(cdp.art)));
      }
    })();
  }, [wallet]);

  useEffect(() => {
    const rsaPerEth = 28500 // get from pip?
    const collateralizationRatio = 1.5;
    const collateralValue = collateral * rsaPerEth;
    const maxLoan = collateralValue / collateralizationRatio;
    console.log(`Max loan: ${maxLoan}`);
    console.log(`Current loan: ${debt}`);
    const remaining = maxLoan - debt;
    setCredit(Math.round(remaining * 100) / 100);
  }, [debt, collateral]);

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
    if (wallet && borrowAmount) {
      console.log("Minting RSA");
      const res = await mintRSA(wallet, borrowAmount);
      console.log(res);
    }
  };

  const handleBridgeAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBridgeAmount(event.target.value);
    let amt = Number(event.target.value);
    if (event.target.value === "") {
      setBridgeAmountError({err: false, msg: "Amount (₹SA)"});
    } else if (amt <= 0) {
      setBridgeAmountError({err: true, msg: "Amount must be greater than zero"});
    } else if (amt > RSABalance) {
      setBridgeAmountError({err: true, msg: "Amount must be less than your balance"});
    } else {
      setBridgeAmountError({err: false, msg: "Amount (₹SA)"});
    }
  };

  const handleLockAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLockAmount(event.target.value);
    let amt = Number(event.target.value);
    if (event.target.value === "") {
      setLockAmountError({err: false, msg: "Amount (ETH)"});
    } else if (amt <= 0) {
      setLockAmountError({err: true, msg: "Amount must be greater than zero"});
    } else if (amt > ETHBalance) {
      setLockAmountError({err: true, msg: "Amount must be less than your balance"});
    } else {
      setLockAmountError({err: false, msg: "Amount (ETH)"});
    }
  };

  const handleBorrowAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBorrowAmount(event.target.value);
    let amt = Number(event.target.value);
    if (event.target.value === "") {
      setBorrowAmountError({err: false, msg: "Amount (₹SA)"});
    } else if (amt <= 0) {
      setBorrowAmountError({err: true, msg: "Amount must be greater than zero"});
    } else if (amt > credit) {
      setBorrowAmountError({err: true, msg: "Amount must less than is available"});
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
          <Typography variant="h6" > Layer 1: Goerli </Typography>
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
          startIcon={<LockIcon />}
        >
          Lock ETH
        </Button>

        <Divider />

        <Typography variant="h6" > Collateral: {collateral} ETH </Typography>
        <Typography variant="h6" > Debt: {debt} ₹SA </Typography>
        <Typography variant="h6" > Available: {credit} ₹SA </Typography>

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
          startIcon={<BorrowIcon />}
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
          startIcon={<BridgeIcon />}
        >
          Kaboot-It to L2
        </Button>

      </div>
    </>
  )
};

