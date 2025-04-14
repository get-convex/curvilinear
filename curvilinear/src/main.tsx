import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LocalStoreProvider } from "local-store/react/LocalStoreProvider";
import { clerkPubKey, convex, localStore } from "./convex";

// Create modal root element
const modalRoot = document.createElement("div");
modalRoot.id = "root-modal";
document.body.appendChild(modalRoot);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <LocalStoreProvider localStoreClient={localStore}>
          <App />
        </LocalStoreProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </React.StrictMode>,
);
