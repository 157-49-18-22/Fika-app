import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Component/Homepage";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import NewArrivals from "./components/NewArrivals.jsx";
import AllProducts from "./components/AllProducts.jsx";
import Blog from "./components/Blog.jsx";
import Contact from "./components/Contact.jsx";
import Cart from "./components/Cart.jsx";
import Wishlist from "./components/Wishlist.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Layout from "./components/Layout.jsx";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              path="/new-arrivals"
              element={
                <Layout>
                  <NewArrivals />
                </Layout>
              }
            />
            <Route
              path="/all-products"
              element={
                <Layout>
                  <AllProducts />
                </Layout>
              }
            />
            <Route
              path="/blog"
              element={
                <Layout>
                  <Blog />
                </Layout>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />
            <Route
              path="/cart"
              element={
                <Layout>
                  <Cart />
                </Layout>
              }
            />
            <Route
              path="/wishlist"
              element={
                <Layout>
                  <Wishlist />
                </Layout>
              }
            />
            <Route
              path="/product/:id"
              element={
                <Layout>
                  <ProductDetails />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
