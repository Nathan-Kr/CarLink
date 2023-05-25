import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { NhostClient, NhostProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import { nhost } from './lib/nhost'
import {Context} from "./Context";
import {createTheme, ThemeProvider} from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: '#EB4E5F',
        },
    },
});

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