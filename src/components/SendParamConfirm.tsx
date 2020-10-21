import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  IconButton,
  TextField,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  Check as ConfirmIcon,
  Clear as RejectIcon,
} from "@material-ui/icons";
import blockies from "ethereum-blockies";

import { SendConfirm } from "./SendConfirm";
import { WalletContext } from "../utils/walletContext";
import { send }from '../utils/account';

const useStyles = makeStyles( theme => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  root: {
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
}));

export const SendParamConfirm = (props: {address: string, amount?: string, reject?: () => void}) => {
  const wallet = useContext(WalletContext).wallet;
  const classes = useStyles();
  const { address, reject } = props;
  const [amount, setAmount] = useState();
  const [amountError, setAmountError] = useState({err: false, msg: "Amount (₹SA)"});
  const [block, setBlock] = useState(true);
  const [txHash, setTxHash] = useState();

  useEffect(() => {
    if (Number(props.amount) > 0) {
      setAmount(props.amount);
    } else {
      setAmountError({err: true, msg: "Amount must be a non-zero number"});
    }
  }, [props]);

  useEffect(() => {
    // TODO: add balance check
    console.log(amountError.err, address);
    if (!amountError.err && address) {
      setBlock(false);
    } else {
      setBlock(true);
    }
  }, [amountError, address]);

  const handleSendConfirm = async () => {
    if (wallet) {
      const res = await send(wallet, address, amount)
      console.log(res)
      if (res && res.txHash) {
        setTxHash(res.txHash);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);

    let amt = Number(event.target.value);
    if (!amt || amt === 0) {
      setAmountError({err: true, msg: "Amount must be a non-zero number"});
      setBlock(true);
    } else {
      setAmountError({err: false, msg: "Amount (₹SA)"});
    }
  };

  if (address) {
    return (
      <Paper>
        <div className={classes.card}>
        { txHash ? <SendConfirm txHash={txHash} amount={amount} />
          : <> 
            <Avatar
              alt={address}
              className={classes.avatar}
              src={blockies.create({
                seed: address,
              }).toDataURL()}
            />
            <Typography variant="caption" gutterBottom={true}> {address} </Typography>
            <TextField
              autoFocus={true}
              id="amount-input"
              error={amountError.err}
              value={amount}
              onChange={handleChange}
              helperText={amountError.msg}
              variant="outlined"
            />
            <IconButton disabled={block} onClick={handleSendConfirm}> <ConfirmIcon /> </IconButton>
            { reject
              ? <IconButton onClick={reject}> <RejectIcon /> </IconButton>
              : <IconButton component={Link} to={`/`}> <RejectIcon /> </IconButton>
            }
            </>
        }
        </div>
      </Paper>
    );
  } else return <div> Loading </div>
}
