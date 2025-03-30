import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="599085776508-oodfl69ilqpedbfm5fukdpse730h17fv.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>
    ,
  </GoogleOAuthProvider>
);
