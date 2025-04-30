import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useAuthRedirect } from "../utils/authUtils";

const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { requireAuth } = useAuthRedirect();

  // Initialize wishlist as empty array
  const [wishlist, setWishlist] = useState([]);

  // Load user's wishlist when they log in or change
  useEffect(() => {
    if (currentUser?.email) {
      const savedWishlist = localStorage.getItem(`wishlist_${currentUser.email}`);
      try {
        const parsedWishlist = savedWishlist ? JSON.parse(savedWishlist) : [];
        setWishlist(parsedWishlist);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (currentUser?.email) {
      localStorage.setItem(`wishlist_${currentUser.email}`, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  const addToWishlist = (product, navigate) => {
    if (!requireAuth('add items to wishlist', navigate)) return;

    setWishlist((prevWishlist) => {
      const existingItemIndex = prevWishlist.findIndex(
        (item) => item.id === product.id
      );

      if (existingItemIndex >= 0) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  const removeFromWishlist = (productId, navigate) => {
    if (!requireAuth('remove items from wishlist', navigate)) return;
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = (navigate) => {
    if (!requireAuth('clear wishlist', navigate)) return;
    setWishlist([]);
    localStorage.removeItem(`wishlist_${currentUser.email}`);
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
