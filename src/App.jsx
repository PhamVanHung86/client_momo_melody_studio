import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PhoneCharms from "./pages/PhoneCharms";
import Keychain from "./pages/Keychain";
import Pins from "./pages/Pins";
import MailClub from "./pages/MailClub";
import Postcards from "./pages/Postcards";
import Stickers from "./pages/Stickers";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ScrollRestoration from "./components/ScrollRestoration";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div>
      <Navbar />
      <ScrollRestoration />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="login" element={<Login />} />
        <Route path="orders" element={<Orders />} />

        <Route path="/phone-charms" element={<PhoneCharms />} />
        <Route path="/keychain" element={<Keychain />} />
        <Route path="/pins" element={<Pins />} />
        <Route path="/mail-clup" element={<MailClub />} />
        <Route path="/postcards" element={<Postcards />} />
        <Route path="/stickers" element={<Stickers />} />

        <Route path="cart" element={<Cart />} />
        <Route
          path="place-order"
          element={
            <ProtectedRoute>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default App;
