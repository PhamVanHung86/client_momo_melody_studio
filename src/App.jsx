import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import Wishlist from "./pages/Wishlist";

const App = () => {
  const location = useLocation();
  return (
    <div>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastClassName="!rounded-2xl !font-medium !text-sm"
        style={{ zIndex: 9999 }}
      />
      <ScrollRestoration />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="cart" element={<Cart />} />
          <Route path="/product/:productId" element={<Product />} />

          {/* Danh mục sản phẩm */}
          <Route path="/phone-charms" element={<PhoneCharms />} />
          <Route path="/keychain" element={<Keychain />} />
          <Route path="/pins" element={<Pins />} />
          <Route path="/postcards" element={<Postcards />} />
          <Route path="/mail-club" element={<MailClub />} />
          <Route path="/stickers" element={<Stickers />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default App;
