import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { db } from './config';

// USERS

/**
 * Get a user by their ID
 * @param {string} userId - The user's ID
 * @returns {Promise<Object|null>} - The user object or null if not found
 */
export const getUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return null;
    }
    return { id: userDoc.id, ...userDoc.data() };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// CART OPERATIONS

/**
 * Get the active cart for a user
 * @param {string} userId - The user's ID (email)
 * @returns {Promise<Object|null>} - The cart object or null if not found
 */
export const getActiveCart = async (userEmail) => {
  try {
    console.log('Getting active cart for:', userEmail);
    const userCartsRef = collection(db, 'userCarts');
    
    // Simplified query that doesn't require a composite index
    const q = query(
      userCartsRef,
      where('userId', '==', userEmail),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log('No active cart found');
      return null;
    }
    
    const activeCart = {
      id: querySnapshot.docs[0].id,
      ...querySnapshot.docs[0].data()
    };
    
    console.log('Found active cart:', activeCart);
    return activeCart;
  } catch (error) {
    console.error('Error getting active cart:', error);
    return null;
  }
};

/**
 * Create a new active cart for a user
 * @param {string} userId - The user's ID (email)
 * @returns {Promise<Object>} - The created cart object
 */
export const createActiveCart = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const newCartRef = doc(collection(db, 'userCarts'));
    const cartData = {
      userId: userId,
      items: [],
      status: 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(newCartRef, cartData);
    
    return { 
      id: newCartRef.id, 
      ...cartData,
      items: []
    };
  } catch (error) {
    console.error('Error creating active cart:', error);
    throw error;
  }
};

/**
 * Update a user's cart with new items
 * @param {string} cartId - The cart ID
 * @param {Array} items - The updated array of cart items
 * @returns {Promise<void>}
 */
export const updateCart = async (cartId, items) => {
  try {
    if (!cartId) {
      throw new Error('Cart ID is required');
    }
    
    const cartRef = doc(db, 'userCarts', cartId);
    await updateDoc(cartRef, {
      items: items,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    throw error;
  }
};

/**
 * Save a copy of the cart as a historical saved cart
 * @param {string} userId - The user's ID (email)
 * @param {Array} items - The cart items to save
 * @returns {Promise<string>} - The ID of the saved cart
 */
export const saveCartHistory = async (userId, items) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const savedCartRef = collection(db, 'userCarts');
    const savedCartDoc = await addDoc(savedCartRef, {
      userId: userId,
      items: items,
      status: 'saved',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return savedCartDoc.id;
  } catch (error) {
    console.error('Error saving cart history:', error);
    throw error;
  }
};

/**
 * Get all saved carts for a user
 * @param {string} userId - The user's ID (email)
 * @returns {Promise<Array>} - Array of saved cart objects
 */
export const getSavedCarts = async (userEmail) => {
  try {
    console.log('Getting saved carts for:', userEmail);
    const userCartsRef = collection(db, 'userCarts');
    
    // Simplified query that doesn't require a composite index
    const q = query(
      userCartsRef,
      where('userId', '==', userEmail),
      where('status', '==', 'saved')
    );
    
    const querySnapshot = await getDocs(q);
    const savedCarts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    console.log('Found saved carts:', savedCarts);
    return savedCarts;
  } catch (error) {
    console.error('Error getting saved carts:', error);
    // Return empty array instead of throwing error
    return [];
  }
};

/**
 * Clear a user's active cart
 * @param {string} cartId - The cart ID
 * @returns {Promise<void>}
 */
export const clearCart = async (cartId) => {
  try {
    if (!cartId) {
      throw new Error('Cart ID is required');
    }
    
    const cartRef = doc(db, 'userCarts', cartId);
    await updateDoc(cartRef, {
      items: [],
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {string} userId - The user's ID
 * @param {Object} userData - The data to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// POSTS

/**
 * Create a new post
 * @param {Object} postData - Post data including content, userId, media, etc.
 * @returns {Promise<string>} - The ID of the created post
 */
export const createPost = async (postData) => {
  try {
    const postsCollection = collection(db, 'posts');
    const postRef = await addDoc(postsCollection, {
      ...postData,
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return postRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Get posts with optional filters
 * @param {Object} options - Query options (limit, userId, etc.)
 * @returns {Promise<Array>} - Array of post objects
 */
export const getPosts = async (options = {}) => {
  try {
    const { userId, limit: queryLimit = 20 } = options;
    
    let postsQuery;
    if (userId) {
      postsQuery = query(
        collection(db, 'posts'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(queryLimit)
      );
    } else {
      postsQuery = query(
        collection(db, 'posts'),
        orderBy('createdAt', 'desc'),
        limit(queryLimit)
      );
    }
    
    const querySnapshot = await getDocs(postsQuery);
    const posts = [];
    
    querySnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return posts;
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
};

/**
 * Get a post by ID
 * @param {string} postId - The post ID
 * @returns {Promise<Object|null>} - The post object or null if not found
 */
export const getPost = async (postId) => {
  try {
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (!postDoc.exists()) {
      return null;
    }
    return { id: postDoc.id, ...postDoc.data() };
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
};

/**
 * Update a post
 * @param {string} postId - The post ID
 * @param {Object} postData - The data to update
 * @returns {Promise<void>}
 */
export const updatePost = async (postId, postData) => {
  try {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...postData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

/**
 * Delete a post
 * @param {string} postId - The post ID to delete
 * @returns {Promise<void>}
 */
export const deletePost = async (postId) => {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// COMMENTS

/**
 * Add a comment to a post
 * @param {string} postId - The post ID
 * @param {Object} commentData - Comment data including content, userId, etc.
 * @returns {Promise<string>} - The ID of the created comment
 */
export const addComment = async (postId, commentData) => {
  try {
    const commentsCollection = collection(db, 'posts', postId, 'comments');
    const commentRef = await addDoc(commentsCollection, {
      ...commentData,
      createdAt: serverTimestamp()
    });

    // Update comment count on the post
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      const currentComments = postDoc.data().comments || 0;
      await updateDoc(postRef, {
        comments: currentComments + 1
      });
    }

    return commentRef.id;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Get comments for a post
 * @param {string} postId - The post ID
 * @returns {Promise<Array>} - Array of comment objects
 */
export const getComments = async (postId) => {
  try {
    const commentsQuery = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(commentsQuery);
    const comments = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return comments;
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
};

// WISH GENIE PRODUCTS

/**
 * Create a new Wish Genie product
 * @param {Object} productData - Product data including all fields
 * @returns {Promise<string>} - The ID of the created product
 */
export const createWishGenieProduct = async (productData) => {
  try {
    // Check if product code already exists
    const productsQuery = query(
      collection(db, 'wish_genie'),
      where('Product code', '==', productData['Product code'])
    );
    const querySnapshot = await getDocs(productsQuery);
    
    if (!querySnapshot.empty) {
      throw new Error('A product with this product code already exists');
    }

    const productsCollection = collection(db, 'wish_genie');
    const productRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return productRef.id;
  } catch (error) {
    console.error('Error creating Wish Genie product:', error);
    throw error;
  }
};

/**
 * Get all Wish Genie products
 * @returns {Promise<Array>} - Array of product objects
 */
export const getWishGenieProducts = async () => {
  try {
    const productsQuery = query(
      collection(db, 'wish_genie'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(productsQuery);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting Wish Genie products:', error);
    throw error;
  }
};

/**
 * Get a Wish Genie product by ID
 * @param {string} productId - The product ID
 * @returns {Promise<Object|null>} - The product object or null if not found
 */
export const getWishGenieProduct = async (productId) => {
  try {
    const productRef = doc(db, 'wish_genie', productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return null;
    }
    return { id: productDoc.id, ...productDoc.data() };
  } catch (error) {
    console.error('Error getting Wish Genie product:', error);
    throw error;
  }
};

/**
 * Update a Wish Genie product
 * @param {string} productId - The product ID
 * @param {Object} productData - The data to update
 * @returns {Promise<void>}
 */
export const updateWishGenieProduct = async (productId, productData) => {
  try {
    // Check if product code already exists in other products
    const productsQuery = query(
      collection(db, 'wish_genie'),
      where('Product code', '==', productData['Product code'])
    );
    const querySnapshot = await getDocs(productsQuery);
    
    // Check if any product other than the current one has the same product code
    const duplicateExists = querySnapshot.docs.some(doc => doc.id !== productId);
    if (duplicateExists) {
      throw new Error('A product with this product code already exists');
    }

    const productRef = doc(db, 'wish_genie', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating Wish Genie product:', error);
    throw error;
  }
};

/**
 * Delete a Wish Genie product
 * @param {string} productId - The product ID to delete
 * @returns {Promise<void>}
 */
export const deleteWishGenieProduct = async (productId) => {
  try {
    await deleteDoc(doc(db, 'wish_genie', productId));
  } catch (error) {
    console.error('Error deleting Wish Genie product:', error);
    throw error;
  }
};

/**
 * Initialize Wish Genie collection with a test product
 * @returns {Promise<void>}
 */
export const initializeWishGenieCollection = async () => {
  try {
    const testProduct = {
      'Burn Time': '32-36 hrs',
      'Burning Instructions': 'Ensure candle is on a heat resistant surface. Trim wick to 5mm before relighting. Do not allow candle to burn to base of vessel.',
      'Category': 'Luxury/Crystal Candles',
      'Diameter': '2.75" (at top) 3.5" (at bottom)',
      'Fragrances': 'British Tea Rose',
      'Height Dimensions': '5" (with lid) 3.5" (w/o lid)',
      'Jar type': 'Silver Bell Jar',
      'MRP': '1590',
      'Product code': '1111',
      'Sticker Content Main': 'Reiki Energised Love Ritual Crystal Candle',
      'Sticker Content Sub': 'Infused with Rose quartz',
      'Product Description': 'Experience the power of love and manifestation with our Reiki Energised Love Ritual Crystal Candle. This beautiful candle is infused with Rose Quartz, known as the stone of universal love. Perfect for creating a romantic atmosphere and enhancing your manifestation practices.',
      'Storage': 'Store In cool and dry place away from sunlight',
      'Type of wax': 'Soy',
      'Wax color': 'white',
      'Weight': '516gms (with lid)',
      'warning': 'Do not leave a burning candle unattended.',
      'createdAt': serverTimestamp(),
      'updatedAt': serverTimestamp()
    };

    const productsCollection = collection(db, 'wish_genie');
    await addDoc(productsCollection, testProduct);
    console.log('Test product added successfully');
  } catch (error) {
    console.error('Error initializing Wish Genie collection:', error);
    throw error;
  }
};

// ADMIN USERS MANAGEMENT

/**
 * Get all users
 * @returns {Promise<Array>} - Array of user objects
 */
export const getAllUsers = async () => {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(usersQuery);
    const users = [];
    
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} userData - User data including all fields
 * @returns {Promise<string>} - The ID of the created user
 */
export const createUser = async (userData) => {
  try {
    const usersCollection = collection(db, 'users');
    const userRef = await addDoc(usersCollection, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return userRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

/**
 * Update a user
 * @param {string} userId - The user ID
 * @param {Object} userData - The data to update
 * @returns {Promise<void>}
 */
export const updateUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Delete a user
 * @param {string} userId - The user ID to delete
 * @returns {Promise<void>}
 */
export const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// DASHBOARD STATISTICS

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} - Object containing various statistics
 */
export const getDashboardStats = async () => {
  try {
    // Get users
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getDocs(usersQuery);
    const users = [];
    usersSnapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
    
    const totalUsers = users.length;
    const maleUsers = users.filter(user => user.gender === 'male').length;
    const femaleUsers = users.filter(user => user.gender === 'female').length;
    const newUsersThisMonth = users.filter(user => {
      if (!user.createdAt) return false;
      const createdDate = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
      const now = new Date();
      return createdDate.getMonth() === now.getMonth() && 
             createdDate.getFullYear() === now.getFullYear();
    }).length;

    // Get regular products
    const regularProductsQuery = query(collection(db, 'products'));
    const regularProductsSnapshot = await getDocs(regularProductsQuery);
    const regularProducts = [];
    regularProductsSnapshot.forEach(doc => regularProducts.push({ id: doc.id, ...doc.data() }));
    
    // Get wish genie products
    const wishGenieQuery = query(collection(db, 'wish_genie'));
    const wishGenieSnapshot = await getDocs(wishGenieQuery);
    const wishGenieProducts = [];
    wishGenieSnapshot.forEach(doc => wishGenieProducts.push({ id: doc.id, ...doc.data() }));
    
    const totalRegularProducts = regularProducts.length;
    const totalWishGenieProducts = wishGenieProducts.length;
    const totalProducts = totalRegularProducts + totalWishGenieProducts;
    
    // Combine categories from both product types
    const regularCategories = new Set(regularProducts.map(product => product.Category));
    const wishGenieCategories = new Set(wishGenieProducts.map(product => product.Category));
    const totalCategories = new Set([...regularCategories, ...wishGenieCategories]).size;

    // Get all orders from both collections using the existing function
    const allOrders = await getAllOrdersForAdmin();
    
    // Calculate order statistics
    const totalOrders = allOrders.length;
    
    // Process orders for various statistics
    let pendingOrders = 0;
    let processingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;
    let completedOrders = 0;
    let cancelledOrders = 0;
    let totalRevenue = 0;
    let totalRatingSum = 0;
    let totalRatingCount = 0;
    let paymentMethods = {
      card: 0,
      netbanking: 0,
      upi: 0,
      wallet: 0,
      cash: 0,
      other: 0
    };
    
    // Order trend data (last 6 months)
    const months = 6;
    const now = new Date();
    const orderTrend = Array(months).fill(0);
    const revenueTrend = Array(months).fill(0);
    
    allOrders.forEach(order => {
      // Status counts
      const status = order.status || 'pending';
      if (status === 'pending') pendingOrders++;
      else if (status === 'processing') processingOrders++;
      else if (status === 'shipped') shippedOrders++;
      else if (status === 'delivered') deliveredOrders++;
      else if (status === 'completed') completedOrders++;
      else if (status === 'cancelled') cancelledOrders++;
      
      // Skip cancelled orders in revenue calculation
      if (status !== 'cancelled') {
        // Calculate total revenue
        let orderTotal = 0;
        
        // Handle different amount formats
        if (order.amount) {
          orderTotal = order.amount;
        } else if (order.total_amount) {
          orderTotal = order.total_amount;
        } else if (order.orderTotal) {
          orderTotal = order.orderTotal;
        }
        
        totalRevenue += orderTotal;
        
        // Track payment methods
        const method = order.payment_method || (order.razorpay_payment_id ? 'online' : 'other');
        if (method.includes('card')) paymentMethods.card++;
        else if (method.includes('netbanking')) paymentMethods.netbanking++;
        else if (method.includes('upi')) paymentMethods.upi++;
        else if (method.includes('wallet')) paymentMethods.wallet++;
        else if (method.includes('cash')) paymentMethods.cash++;
        else paymentMethods.other++;
      }
      
      // Handle ratings
      if (order.rating) {
        totalRatingSum += order.rating;
        totalRatingCount++;
      }
      
      // Calculate order trend (last 6 months)
      const orderDate = order.created_at?.toDate?.() || 
                        new Date(order.created_at || order.orderDate || Date.now());
      
      for (let i = 0; i < months; i++) {
        const trendMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
        if (orderDate.getMonth() === trendMonth.getMonth() && 
            orderDate.getFullYear() === trendMonth.getFullYear()) {
          orderTrend[i]++;
          
          // Only add to revenue trend if not cancelled
          if (status !== 'cancelled') {
            let orderAmount = 0;
            if (order.amount) orderAmount = order.amount ;
            else if (order.total_amount) orderAmount = order.total_amount;
            else if (order.orderTotal) orderAmount = order.orderTotal;
            
            revenueTrend[i] += orderAmount;
          }
          break;
        }
      }
    });
    
    // Calculate average order value (AOV)
    const nonCancelledOrders = allOrders.filter(order => order.status !== 'cancelled').length;
    const averageOrderValue = nonCancelledOrders > 0 ? totalRevenue / nonCancelledOrders : 0;
    
    // Calculate average rating
    const averageRating = totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0;

    // Create month labels for trends
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendLabels = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trendLabels.unshift(`${monthNames[d.getMonth()]} ${d.getFullYear()}`);
    }

    return {
      totalUsers,
      maleUsers,
      femaleUsers,
      newUsersThisMonth,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      completedOrders,
      cancelledOrders,
      totalProducts,
      totalRegularProducts,
      totalWishGenieProducts,
      totalCategories,
      totalRevenue,
      averageOrderValue,
      averageRating,
      paymentMethods,
      orderTrend: {
        labels: trendLabels,
        data: orderTrend.slice().reverse() // Reverse to match labels
      },
      revenueTrend: {
        labels: trendLabels,
        data: revenueTrend.slice().reverse() // Reverse to match labels
      }
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
};

// ORDERS MANAGEMENT

/**
 * Get all orders
 * @returns {Promise<Array>} - Array of order objects
 */
export const getOrders = async () => {
  try {
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - The order ID
 * @param {string} newStatus - The new status
 * @param {string} source - The collection source ('orders' or 'successfulPayments')
 * @returns {Promise<void>}
 */
export const updateOrderStatus = async (orderId, newStatus, source = 'orders') => {
  try {
    // Determine which collection to update based on source
    const collectionName = source === 'successfulPayments' ? 'successfulPayments' : 'orders';
    
    console.log(`Updating order status in ${collectionName} collection for order ${orderId} to ${newStatus}`);
    
    const orderRef = doc(db, collectionName, orderId);
    
    // Update fields based on the collection
    if (collectionName === 'successfulPayments') {
      await updateDoc(orderRef, {
        status: newStatus,
        payment_status: newStatus,
        updated_at: serverTimestamp()
      });
    } else {
      await updateDoc(orderRef, {
        status: newStatus,
        updated_at: serverTimestamp()
      });
    }
    
    console.log(`Successfully updated order ${orderId} status to ${newStatus}`);
  } catch (error) {
    console.error(`Error updating order status in ${source} collection:`, error);
    throw error;
  }
};

/**
 * Delete an order
 * @param {string} orderId - The order ID to delete
 * @param {string} source - The collection source ('orders' or 'successfulPayments')
 * @returns {Promise<void>}
 */
export const deleteOrder = async (orderId, source = 'orders') => {
  try {
    // Determine which collection to delete from based on source
    const collectionName = source === 'successfulPayments' ? 'successfulPayments' : 'orders';
    console.log(`Deleting order from ${collectionName} collection: ${orderId}`);
    
    await deleteDoc(doc(db, collectionName, orderId));
    
    // Also try to delete from user's orders subcollection if userId is known
    try {
      // First, get the order to find the userId
      const orderSnapshot = await getDoc(doc(db, collectionName, orderId));
      if (orderSnapshot.exists()) {
        const orderData = orderSnapshot.data();
        const userId = orderData.userId;
        
        if (userId) {
          // Delete from user's orders subcollection
          await deleteDoc(doc(db, 'users', userId, 'orders', orderId));
          console.log(`Also deleted from user's orders subcollection`);
        }
      }
    } catch (userOrderError) {
      console.log('Could not delete from user orders subcollection:', userOrderError);
      // Continue with the main function even if this fails
    }
    
    console.log(`Successfully deleted order ${orderId}`);
  } catch (error) {
    console.error(`Error deleting order from ${source} collection:`, error);
    throw error;
  }
};

// FEATURED PRODUCTS

/**
 * Get featured products
 * @returns {Promise<Array>} - Array of featured product objects
 */
export const getFeaturedProducts = async () => {
  try {
    const productsQuery = query(
      collection(db, 'products'),
      where('featured', '==', true),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(productsQuery);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};

/**
 * Update product featured status
 * @param {string} productId - The product ID
 * @param {boolean} featured - The new featured status
 * @returns {Promise<void>}
 */
export const updateProductFeaturedStatus = async (productId, featured) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      featured,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating product featured status:', error);
    throw error;
  }
};

/**
 * Initialize featured field for existing products
 * @returns {Promise<void>}
 */
export const initializeFeaturedField = async () => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot = await getDocs(productsRef);
    
    const updatePromises = querySnapshot.docs.map(async (doc) => {
      const productRef = doc.ref;
      const productData = doc.data();
      
      // Only update if featured field doesn't exist
      if (productData.featured === undefined) {
        await updateDoc(productRef, {
          featured: false, // Set default value to false
          updatedAt: serverTimestamp()
        });
        console.log(`Updated product ${doc.id} with featured field`);
      }
    });
    
    await Promise.all(updatePromises);
    console.log('Successfully initialized featured field for all products');
  } catch (error) {
    console.error('Error initializing featured field:', error);
    throw error;
  }
};

// Get a single order by ID
export const getOrder = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      // Try to find in the successful payments collection
      const successPaymentRef = doc(db, 'successfulPayments', orderId);
      const successPaymentSnap = await getDoc(successPaymentRef);
      
      if (successPaymentSnap.exists()) {
        return {
          id: successPaymentSnap.id,
          ...successPaymentSnap.data()
        };
      }
      
      throw new Error('Order not found');
    }

    return {
      id: orderSnap.id,
      ...orderSnap.data()
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

// Save successful payment details even if order doesn't exist
export const saveSuccessfulPayment = async (paymentData) => {
  try {
    const { 
      orderId, 
      paymentId, 
      signature, 
      amount,
      currency,
      items,
      userId,
      userDetails,
      ...otherData 
    } = paymentData;
    
    // Use the order ID as the document ID
    const paymentRef = doc(db, 'successfulPayments', orderId);
    
    // Get current timestamp
    const timestamp = serverTimestamp();
    
    // Save the payment information with comprehensive details
    await setDoc(paymentRef, {
      // Payment identifiers
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      
      // Order details
      amount: amount,
      currency: currency || 'INR',
      items: items || [],
      total_items: items ? items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0,
      total_amount: amount,
      
      // User information
      userId: userId || null,
      userDetails: userDetails || {},
      
      // Order status
      status: 'completed',
      payment_status: 'successful',
      fulfillment_status: 'pending',
      
      // Timestamps
      created_at: timestamp,
      updated_at: timestamp,
      payment_date: timestamp,
      
      // Additional metadata
      payment_method: 'razorpay',
      payment_mode: 'online',
      ...otherData
    });
    
    // If we have a userId, also save a reference in the user's orders collection
    if (userId) {
      try {
        const userOrderRef = doc(db, 'users', userId, 'orders', orderId);
        await setDoc(userOrderRef, {
          orderId: orderId,
          created_at: timestamp,
          amount: amount,
          status: 'completed',
          items: items || []
        });
        console.log('Also saved order reference to user\'s orders collection');
      } catch (userOrderError) {
        console.error('Error saving to user orders collection:', userOrderError);
      }
    }
    
    console.log('Successfully saved payment to backup collection:', orderId);
    return orderId;
  } catch (error) {
    console.error('Error saving successful payment:', error);
    throw error;
  }
};

// Get a user's orders from both orders and successfulPayments collections
export const getUserOrders = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    const orders = [];
    
    // Check the main orders collection
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('userId', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      ordersSnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data()
        });
      });
    } catch (error) {
      console.error('Error fetching from orders collection:', error);
    }
    
    // Check the user's orders subcollection
    try {
      const userOrdersQuery = query(
        collection(db, 'users', userId, 'orders'),
        orderBy('created_at', 'desc')
      );
      
      const userOrdersSnapshot = await getDocs(userOrdersQuery);
      const userOrderIds = new Set(orders.map(order => order.id || order.orderId));
      
      userOrdersSnapshot.forEach((doc) => {
        // Avoid duplicates
        if (!userOrderIds.has(doc.id)) {
          orders.push({
            id: doc.id,
            ...doc.data()
          });
          userOrderIds.add(doc.id);
        }
      });
    } catch (error) {
      console.error('Error fetching from user orders subcollection:', error);
    }
    
    // Check the successfulPayments collection
    try {
      const successfulPaymentsQuery = query(
        collection(db, 'successfulPayments'),
        where('userId', '==', userId),
        orderBy('created_at', 'desc')
      );
      
      const successfulPaymentsSnapshot = await getDocs(successfulPaymentsQuery);
      const existingOrderIds = new Set(orders.map(order => order.id || order.orderId || order.razorpay_order_id));
      
      successfulPaymentsSnapshot.forEach((doc) => {
        // Avoid duplicates
        if (!existingOrderIds.has(doc.id) && !existingOrderIds.has(doc.data().razorpay_order_id)) {
          orders.push({
            id: doc.id,
            ...doc.data()
          });
        }
      });
    } catch (error) {
      console.error('Error fetching from successfulPayments collection:', error);
    }
    
    // Sort by creation date
    return orders.sort((a, b) => {
      const dateA = a.created_at?.toDate?.() || new Date(a.created_at || a.orderDate || 0);
      const dateB = b.created_at?.toDate?.() || new Date(b.created_at || b.orderDate || 0);
      return dateB - dateA; // Most recent first
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Get all orders from both orders and successfulPayments collections for admin
export const getAllOrdersForAdmin = async () => {
  try {
    const allOrders = [];
    
    // Get orders from the main orders collection
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        orderBy('created_at', 'desc')
      );
      
      const ordersSnapshot = await getDocs(ordersQuery);
      ordersSnapshot.forEach((doc) => {
        allOrders.push({
          id: doc.id,
          source: 'orders',
          ...doc.data()
        });
      });
    } catch (error) {
      console.error('Error fetching from orders collection:', error);
    }
    
    // Get orders from the successfulPayments collection
    try {
      const successfulPaymentsQuery = query(
        collection(db, 'successfulPayments'),
        orderBy('created_at', 'desc')
      );
      
      const successfulPaymentsSnapshot = await getDocs(successfulPaymentsQuery);
      const existingOrderIds = new Set(allOrders.map(order => order.razorpay_order_id || order.id));
      
      successfulPaymentsSnapshot.forEach((doc) => {
        const data = doc.data();
        // Avoid duplicates
        if (!existingOrderIds.has(doc.id) && !existingOrderIds.has(data.razorpay_order_id)) {
          allOrders.push({
            id: doc.id,
            source: 'successfulPayments',
            ...data
          });
        }
      });
    } catch (error) {
      console.error('Error fetching from successfulPayments collection:', error);
    }
    
    // Sort all orders by creation date
    return allOrders.sort((a, b) => {
      const dateA = a.created_at?.toDate?.() || new Date(a.created_at || a.orderDate || 0);
      const dateB = b.created_at?.toDate?.() || new Date(b.created_at || b.orderDate || 0);
      return dateB - dateA; // Most recent first
    });
  } catch (error) {
    console.error('Error getting all orders for admin:', error);
    throw error;
  }
}; 