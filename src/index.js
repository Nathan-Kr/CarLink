import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { NhostClient, NhostProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import {Context} from "./Context";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import { frFR } from '@mui/material/locale';
import { frFR as dateFR } from '@mui/x-date-pickers/locales';

const nhost = new NhostClient({
    subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN,
    region: process.env.REACT_APP_NHOST_REGION
})

const theme = createTheme({
    palette: {
        primary: {
            main: '#EB4E5F',
        },

    }},
    dateFR,
    frFR
);

ReactDOM.render(
  <React.StrictMode>
      <NhostProvider nhost={nhost}>
          <NhostApolloProvider nhost={nhost}>
            <Context>
              <BrowserRouter>
                  <ThemeProvider theme={theme}>
                      <App />
                  </ThemeProvider>
              </BrowserRouter>
            </Context>
          </NhostApolloProvider>
      </NhostProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
export { nhost }