import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

const clerkPubKey =
  "pk_test_c3BlY2lhbC1tYWNrZXJlbC04Ni5jbGVyay5hY2NvdW50cy5kZXYk";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
// Create modal root element
const modalRoot = document.createElement("div");
modalRoot.id = "root-modal";
document.body.appendChild(modalRoot);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <App />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
