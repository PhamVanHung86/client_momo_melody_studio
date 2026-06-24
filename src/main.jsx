import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import AuthProvider from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </AuthProvider>
  </BrowserRouter>,
);
