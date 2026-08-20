import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import AuthProvider from "./context/AuthContext";
import { HelmetProvider } from "react-helmet-async";
import ServerWakeGate from "./components/ServerWakeGate.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HelmetProvider>
      <ServerWakeGate>
        <AuthProvider>
          <ShopContextProvider>
            <App />
          </ShopContextProvider>
        </AuthProvider>
      </ServerWakeGate>
    </HelmetProvider>
  </BrowserRouter>,
);
