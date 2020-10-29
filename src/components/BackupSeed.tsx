import React  from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import {
  ArrowBack as BackIcon,
  VpnKey as KeyIcon,
  EnhancedEncryption as LockIcon,
  Note as SaveIcon,
} from "@material-ui/icons";
import { loadSecret } from "../utils/initialize";
import { walletSecretFYI } from "../utils/constants";

const useStyles = makeStyles( theme => ({
  back: {
    marginRight: theme.spacing(2),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  textBox: {
    width: "80%",
  },
  typography: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

export const BackupSeed = (props: any) => {
  const classes = useStyles();
  const secret = loadSecret();

  return (
    <>
      <IconButton className={classes.back} component={Link} to={"/"}>
        <BackIcon />
      </IconButton>
      <Paper className={classes.paper}>
        <Typography variant="h5"> Your Magic Words</Typography>
        <Typography align="center" variant="caption" className={classes.typography}>
          A secret key is a unique combination of 12 words associated with your wallet
        </Typography>
        <TextField
          disabled
          id="secret-key"
          className={classes.textBox}
          inputProps={{style: { textAlign: "center" }}}
          InputProps={{style: { letterSpacing: "2px" }}}
          defaultValue={secret}
          margin="normal"
          multiline
          rows={4}
          variant="filled"
        />
        
        <List>
          <ListItem>
            <ListItemIcon> <KeyIcon /> </ListItemIcon>
            <ListItemText primary={walletSecretFYI[0]} />
          </ListItem>
          <ListItem>
            <ListItemIcon> <LockIcon /> </ListItemIcon>
            <ListItemText primary={walletSecretFYI[1]} />
          </ListItem>
          <ListItem>
            <ListItemIcon> <SaveIcon /> </ListItemIcon>
            <ListItemText primary={walletSecretFYI[2]} />
          </ListItem>
        </List>
      </Paper>
    </>
  )
};
