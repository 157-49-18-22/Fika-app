import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import Homepage from './Component/Homepage.jsx';
import NewArrivals from './components/NewArrivals/NewArrivals.jsx';
import AllProducts from './components/AllProducts/AllProducts.jsx';
import Blog from './components/Blog/Blog.jsx';
import Contact from './components/Contact/Contact.jsx';
import ProductDetails from './components/ProductDetails/ProductDetails.jsx';
import Cart from './components/Cart.jsx';
import Wishlist from './components/Wishlist/Wishlist.jsx';
import CategoryProducts from './components/CategoryProducts/CategoryProducts.jsx';
import Navbar from './Component/Navbar/Navbar.jsx';
import './App.css';

// Non-homepage layout component
const PageLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/new-arrivals" element={
              <PageLayout>
                <NewArrivals />
              </PageLayout>
            } />
            <Route path="/all-products" element={
              <PageLayout>
                <AllProducts />
              </PageLayout>
            } />
            <Route path="/blog" element={
              <PageLayout>
                <Blog />
              </PageLayout>
            } />
            <Route path="/contact" element={
              <PageLayout>
                <Contact />
              </PageLayout>
            } />
            <Route path="/product/:id" element={
              <PageLayout>
                <ProductDetails />
              </PageLayout>
            } />
            <Route path="/cart" element={
              <PageLayout>
                <Cart />
              </PageLayout>
            } />
            <Route path="/wishlist" element={
              <PageLayout>
                <Wishlist />
              </PageLayout>
            } />
            <Route path="/category/:categoryName" element={
              <PageLayout>
                <CategoryProducts />
              </PageLayout>
            } />
          </Routes>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
