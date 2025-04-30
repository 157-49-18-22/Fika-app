import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
<<<<<<< HEAD
import { useAuthRedirect } from "../utils/authUtils";
=======
>>>>>>> 0c6c6f502019923f6ee4fd1657bc9331f5376831

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
<<<<<<< HEAD
  const { requireAuth } = useAuthRedirect();
=======
>>>>>>> 0c6c6f502019923f6ee4fd1657bc9331f5376831
  
  // Initialize cart from localStorage or empty array
  const [cart, setCart] = useState([]);

  // Load user's cart when they log in or change
  useEffect(() => {
    if (currentUser?.email) {
      const savedCart = localStorage.getItem(`cart_${currentUser.email}`);
      try {
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [currentUser]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

<<<<<<< HEAD
  const addToCart = (product, size = "default", quantity = 1, navigate) => {
    if (!requireAuth('add items to cart', navigate)) return;
=======
  const addToCart = (product, size = "default", quantity = 1) => {
    if (!currentUser?.email) {
      console.log('Please login to add items to cart');
      return;
    }
>>>>>>> 0c6c6f502019923f6ee4fd1657bc9331f5376831
    
    if (!product || !product.id) {
      console.error('Invalid product data:', product);
      return;
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === product.id && (!size || item.size === size)
      );

      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            image: product.image,
            category: product.category,
            size,
            quantity: quantity || 1,
          },
        ];
      }
    });
  };

<<<<<<< HEAD
  const removeFromCart = (productId, navigate) => {
    if (!requireAuth('remove items from cart', navigate)) return;
=======
  const removeFromCart = (productId) => {
    if (!currentUser?.email) return;
>>>>>>> 0c6c6f502019923f6ee4fd1657bc9331f5376831
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== productId)
    );
  };

<<<<<<< HEAD
  const updateQuantity = (productId, newQuantity, navigate) => {
    if (!requireAuth('update cart quantity', navigate) || newQuantity < 1) return;
=======
  const updateQuantity = (productId, newQuantity) => {
    if (!currentUser?.email || newQuantity < 1) return;
>>>>>>> 0c6c6f502019923f6ee4fd1657bc9331f5376831

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discount
        ? item.price * (1 - item.discount / 100)
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

<<<<<<< HEAD
  const clearCart = (navigate) => {
    if (!requireAuth('clear cart', navigate)) return;
=======
  const clearCart = () => {
    if (!currentUser?.email) return;
>>>>>>> 0c6c6f502019923f6ee4fd1657bc9331f5376831
    setCart([]);
    localStorage.removeItem(`cart_${currentUser.email}`);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartCount,
    getCartTotal,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
