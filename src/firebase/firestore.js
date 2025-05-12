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