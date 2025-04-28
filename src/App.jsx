import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
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
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup.jsx';
import './App.css';
import Footer from './Component/Footer/Footer.jsx';

// Non-homepage layout component
const PageLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Homepage />
                </ProtectedRoute>
              } />
              <Route path="/new-arrivals" element={
                <ProtectedRoute>
                  <PageLayout>
                    <NewArrivals />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/all-products" element={
                <ProtectedRoute>
                  <PageLayout>
                    <AllProducts />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/blog" element={
                <ProtectedRoute>
                  <PageLayout>
                    <Blog />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <ProtectedRoute>
                  <PageLayout>
                    <Contact />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/product/:id" element={
                <ProtectedRoute>
                  <PageLayout>
                    <ProductDetails />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <PageLayout>
                    <Cart />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <PageLayout>
                    <Wishlist />
                  </PageLayout>
                </ProtectedRoute>
              } />
              <Route path="/category/:categoryName" element={
                <ProtectedRoute>
                  <PageLayout>
                    <CategoryProducts />
                  </PageLayout>
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
