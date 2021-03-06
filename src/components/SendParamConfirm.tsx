import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  TextField,
  Paper,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  Check as ConfirmIcon,
} from "@material-ui/icons";
import blockies from "ethereum-blockies";

import { SendConfirm } from "./SendConfirm";
import { SendProcessing } from "./SendProcessing";
import { WalletContext } from "../utils/walletContext";
import { send, balance }from '../utils/account';
import { loadMaticClient } from '../utils/initialize';

const useStyles = makeStyles( theme => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  button: {
    background: 'linear-gradient(269.86deg, #636CC5 0.12%, #1AC3C4 98.96%)',
    color: "white",
    marginBottom: theme.spacing(3),
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

export const SendParamConfirm = (props: {address: string, amount?: string}) => {
  const wallet = useContext(WalletContext).wallet;
  const classes = useStyles();
  const { address } = props;
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState({err: false, msg: "Amount (₹SA)"});
  const [block, setBlock] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [txHash, setTxHash] = useState();
  const [maticClient, setMatiClient] = useState();

  useEffect(() => {
    (async () => {
      if (wallet) {
        const mClient = await loadMaticClient(wallet.address);
        setMatiClient(mClient);
      }
    })();
  }, [wallet]);

  useEffect(() => {
    if (Number(props.amount) > 0) {
      setAmount(props.amount || "");
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

  useEffect(() => {
    if (txHash) setProcessing(false);
  }, [txHash]);

  const handleSendConfirm = async () => {
    if (wallet && maticClient) {
      const bal = await balance(
        wallet.address,
        maticClient
      );

      console.log(bal, amount);
      if (Number(amount) <= bal) {
        setProcessing(true);
        const res = await send(wallet, address, amount)
        if (res && res.txHash) {
          setTxHash(res.txHash);
        }
      } else {
        setAmountError({err: true, msg: "Insufficient balance! Please load up more."});
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value || "");

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
        { processing ? <SendProcessing amount={amount} /> : txHash ? <SendConfirm txHash={txHash} amount={amount} />
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
              <Button
                className={classes.button}
                disabled={block}
                onClick={handleSendConfirm}
                startIcon={<ConfirmIcon />}
                variant="contained"
                size="large"
              > 
                Confirm
              </Button>
            </>
        }
        </div>
      </Paper>
    );
  } else return <div> Loading </div>
}
