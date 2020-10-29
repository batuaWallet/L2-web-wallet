import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
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
import { getRSABalance, approveForDeposit, depositERC20toMatic }from '../utils/account';
import { lockInCDP } from "../utils/cdpUtils";

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
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(2),
  },
}));

export const EnterL2 = (props: any) => {
  const classes = useStyles();
  const wallet = useContext(WalletContext).wallet;

  const [amount, setAmount] = useState();
  const [block, setBlock] = useState(true);
  const [amountError, setAmountError] = useState({err: false, msg: "Amount (₹SA)"});

  const [RSABalance, setRSABalance] = useState(0);

  useEffect(() => {
    if (Number(props.amount) > 0) {
      setAmount(props.amount);
    } else {
      setAmountError({err: true, msg: "Amount must be a non-zero number"});
    }
  }, [props]);

  useEffect(() => {
    (async () => {
      if (wallet) {
        const bal = await getRSABalance(wallet.address);
        console.log(bal)
        setRSABalance(bal);
      }
    })();
  }, [wallet]);

  const handleSwitch = async () => {
    if (wallet) {
      console.log("Depositing to L2");
      const approvalRes = await approveForDeposit(wallet);
      if (approvalRes) {
        const depositRes = depositERC20toMatic(wallet, '1.32');
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
    let amt = Number(event.target.value);
    if (!amt || amt === 0) {
      setAmountError({err: true, msg: "Amount must be a non-zero number"});
      setBlock(true);
    } else {
      setAmountError({err: false, msg: "Amount (₹SA)"});
      setBlock(false);
    }
  };

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
          onClick={() => handleLock()}
          className={classes.zap}
          startIcon={<ZapIcon />}
        >
          Foob-It for CDP
        </Button>
        <Button
          color="primary"
          variant="outlined"
          onClick={() => handleMint()}
          className={classes.zap}
          startIcon={<ZapIcon />}
        >
          Doob-It for RSA
        </Button>
        <p> Balance: {RSABalance} </p>

        <TextField
          autoFocus={true}
          id="amount-input"
          error={amountError.err}
          value={amount}
          onChange={handleChange}
          helperText={amountError.msg}
          variant="outlined"
        />

        <Button
          color="primary"
          variant="outlined"
          disabled={block}
          onClick={() => handleSwitch()}
          className={classes.zap}
          startIcon={<ZapIcon />}
        >
          Kaboob-It to L2
        </Button>

      </div>
    </>
  )
};

