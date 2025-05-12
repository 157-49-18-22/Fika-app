import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useAuthRedirect } from "../utils/authUtils";
import { db } from '../firebase/config';
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { requireAuth } = useAuthRedirect();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user's cart from Firestore when they log in
  useEffect(() => {
    const loadCart = async () => {
      if (!currentUser?.email) {
        setCart([]);
        setLoading(false);
        return;
      }

      try {
        const cartRef = collection(db, 'carts');
        const q = query(cartRef, where('userId', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const cartData = querySnapshot.docs[0].data();
          setCart(cartData.items || []);
        } else {
          // Create new cart document if it doesn't exist
          const newCartRef = doc(collection(db, 'carts'));
          await setDoc(newCartRef, {
            userId: currentUser.email,
            items: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          setCart([]);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [currentUser]);

  // Save cart to Firestore whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (!currentUser?.email || loading) return;

      try {
        const cartRef = collection(db, 'carts');
        const q = query(cartRef, where('userId', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const cartDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, 'carts', cartDoc.id), {
            items: cart,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    saveCart();
  }, [cart, currentUser, loading]);

  const addToCart = async (product, size = "default", quantity = 1, navigate) => {
    console.log('CartContext: addToCart called with:', { product, size, quantity });
    
    if (!requireAuth('add items to cart', navigate)) {
      console.log('CartContext: Auth check failed');
      return;
    }
    
    if (!product || !product.id) {
      console.error('CartContext: Invalid product data:', product);
      return;
    }

    try {
      // First, update the local state for immediate user feedback
      setCart(prevCart => {
        const existingItemIndex = prevCart.findIndex(
          item => item.id === product.id && item.size === size
        );
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updatedCart = [...prevCart];
          updatedCart[existingItemIndex].quantity += quantity;
          return updatedCart;
        } else {
          // Add new item
          return [
            ...prevCart,
            {
              id: product.id,
              name: product.name || product.product_name,
              price: product.price || product.mrp,
              discount: product.discount || 0,
              image: product.image || '/placeholder-image.jpg',
              category: product.category,
              size: size,
              quantity: quantity || 1,
              color: product.color || 'Default'
            }
          ];
        }
      });
      
      // Then, save to Firebase asynchronously (don't wait for completion)
      if (currentUser?.email) {
        const cartRef = collection(db, 'carts');
        const q = query(cartRef, where('userId', '==', currentUser.email));
        
        getDocs(q).then(querySnapshot => {
          if (querySnapshot.empty) {
            // Create new cart
            const newCartRef = doc(collection(db, 'carts'));
            setDoc(newCartRef, {
              userId: currentUser.email,
              items: [...cart, {
                id: product.id,
                name: product.name || product.product_name,
                price: product.price || product.mrp,
                discount: product.discount || 0,
                image: product.image || '/placeholder-image.jpg',
                category: product.category,
                size: size,
                quantity: quantity || 1,
                color: product.color || 'Default'
              }],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          } else {
            // Update existing cart
            const cartDoc = querySnapshot.docs[0];
            const cartData = cartDoc.data();
            const currentItems = cartData.items || [];
            
            const existingItemIndex = currentItems.findIndex(
              item => item.id === product.id && item.size === size
            );
            
            let updatedItems;
            if (existingItemIndex >= 0) {
              updatedItems = [...currentItems];
              updatedItems[existingItemIndex].quantity += quantity;
            } else {
              updatedItems = [
                ...currentItems,
                {
                  id: product.id,
                  name: product.name || product.product_name,
                  price: product.price || product.mrp,
                  discount: product.discount || 0,
                  image: product.image || '/placeholder-image.jpg',
                  category: product.category,
                  size: size,
                  quantity: quantity || 1,
                  color: product.color || 'Default'
                }
              ];
            }
            
            updateDoc(doc(db, 'carts', cartDoc.id), {
              items: updatedItems,
              updatedAt: new Date().toISOString()
            });
          }
        }).catch(error => {
          console.error('Error saving cart to Firebase:', error);
        });
      }
    } catch (error) {
      console.error('CartContext: Error in addToCart:', error);
    }
  };

  const removeFromCart = async (productId, navigate) => {
    if (!requireAuth('remove items from cart', navigate)) return;
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = async (productId, newQuantity, navigate) => {
    if (!requireAuth('update cart quantity', navigate) || newQuantity < 1) return;

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

  const clearCart = async (navigate) => {
    if (!requireAuth('clear cart', navigate)) return;
    setCart([]);
  };

  const value = {
    cart,
    loading,
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
