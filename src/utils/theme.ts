import { createMuiTheme } from '@material-ui/core';

const dark = createMuiTheme({
  palette: {
    primary: {
      main: "#004d40",
    },
    secondary: {
      main: "#e699a6",
    },
    type: "dark",
  },
});

const light = createMuiTheme({
  palette: {
    primary: {
      main: "#deaa56",
    },
    secondary: {
      main: "#e699a6",
    },
    type: "dark",
  },
});

export { dark, light };
