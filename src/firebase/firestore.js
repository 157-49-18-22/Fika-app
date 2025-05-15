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

/**
 * Update a user's profile
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

    // Get products
    const productsQuery = query(collection(db, 'wish_genie'));
    const productsSnapshot = await getDocs(productsQuery);
    const products = [];
    productsSnapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
    
    const totalProducts = products.length;
    const categories = new Set(products.map(product => product.Category));
    const totalCategories = categories.size;

    // Get orders (if you have an orders collection)
    let totalOrders = 0;
    let pendingOrders = 0;
    let totalRevenue = 0;
    let averageRating = 0;

    try {
      const ordersQuery = query(collection(db, 'orders'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = [];
      ordersSnapshot.forEach(doc => orders.push({ id: doc.id, ...doc.data() }));
      
      totalOrders = orders.length;
      pendingOrders = orders.filter(order => order.status === 'pending').length;
      totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      // Calculate average rating if you have ratings
      const ratings = orders.filter(order => order.rating).map(order => order.rating);
      if (ratings.length > 0) {
        averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      }
    } catch (error) {
      console.log('Orders collection not found or error:', error);
    }

    return {
      totalUsers,
      maleUsers,
      femaleUsers,
      totalOrders,
      totalProducts,
      totalCategories,
      totalRevenue,
      pendingOrders,
      averageRating
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}; 