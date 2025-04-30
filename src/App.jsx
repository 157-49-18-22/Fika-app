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
import Cart from './components/Cart/Cart.jsx';
import Wishlist from './components/Wishlist/Wishlist.jsx';
import CategoryProducts from './components/CategoryProducts/CategoryProducts.jsx';
import Navbar from './Component/Navbar/Navbar.jsx';
import Login from './components/Login/Login.jsx';
import Signup from './components/Signup.jsx';
import './App.css';
import Footer from './Component/Footer/Footer.jsx';
import Profile from './Component/Profile/Profile.jsx';

// Layout component with navbar and footer
const PageLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

// Protected Route component for features that require login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <PageLayout>{children}</PageLayout>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <PageLayout>
                  <Homepage />
                </PageLayout>
              } />
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
              <Route path="/category/:categoryName" element={
                <PageLayout>
                  <CategoryProducts />
                </PageLayout>
              } />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes - Require Login */}
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/wishlist" element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
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
