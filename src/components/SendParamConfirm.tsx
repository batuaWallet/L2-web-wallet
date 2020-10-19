import React, { useEffect, useState } from "react";
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
import blockies from "ethereum-blockies"

const useStyles = makeStyles( theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(3),
    bottom: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export const SendParamConfirm = (props: {address: string, reject: () => void}) => {
  const classes = useStyles();
  const { address, reject } = props;
  const [amount, setAmount] = useState("0");
  const [amountError, setAmountError] = useState({err: true, msg: "Amount (₹SA)"});
  const [block, setBlock] = useState(true);

  useEffect(() => {
    // TODO: add balance check
    if (!amountError.err && address) {
      setBlock(false);
    }
  }, [amountError, address]);

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
        <div className={classes.root}>
          <Avatar
            alt={address}
            className={classes.avatar}
            src={blockies.create({
              seed: address,
            }).toDataURL()}
          />
          <Typography variant="caption" gutterBottom={true}> {address} </Typography>
          <TextField
            id="amount-input"
            error={amountError.err}
            value={amount}
            onChange={handleChange}
            helperText={amountError.msg}
            variant="outlined"
          />
          <IconButton disabled={block} component={Link} to={`/send/${address}/${amount}`}> <ConfirmIcon /> </IconButton>
          <IconButton onClick={reject}> <RejectIcon /> </IconButton>
        </div>
      </Paper>
    );
  } else return <div> Loading </div>
};
