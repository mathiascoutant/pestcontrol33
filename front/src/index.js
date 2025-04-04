import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n/i18n";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: "#B6DEDD",
    },
    secondary: {
      main: "#FF0000",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          textTransform: "capitalize",
          color: "black",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={defaultTheme}>
        <App />
      </ThemeProvider>
    </I18nextProvider>
  </React.StrictMode>
);
