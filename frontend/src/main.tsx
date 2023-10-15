import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import Web3ContextProvider from "./context/Web3Context";
import "./globals.scss";
import { router } from "./router";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Web3ContextProvider>
            <RouterProvider router={router} />
        </Web3ContextProvider>
    </React.StrictMode>
);
