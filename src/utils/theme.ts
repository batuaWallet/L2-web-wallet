import { createMuiTheme } from '@material-ui/core';

const dark = createMuiTheme({
  palette: {
    primary: {
      main: "#FF779B",
    },
    secondary: {
      main: "#1BC2C4",
    },
    type: "dark",
    background: {
      default: "#343961",
      paper: "#3E4768",
    },
  },
  typography: {
    fontFamily: "Open Sans",
  },
});

const light = createMuiTheme({
  palette: {
    primary: {
      main: "#55C8D0",
    },
    secondary: {
      main: "#FF779B",
    },
    type: "light",
  },
  typography: {
    fontFamily: "Open Sans",
  },
});

export { dark, light };
