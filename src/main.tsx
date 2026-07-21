import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "react-hot-toast";

import App from "./App";
import  theme  from "./theme/theme";
import "./styles/globals.css";

import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <BrowserRouter>
          <AuthProvider>
            <App />

            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
            />
          </AuthProvider>
        </BrowserRouter>

      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);