const { db } = require('../config/firebase');
const { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp 
} = require('firebase/firestore');

// Get all Wish Genie products
exports.getAllProducts = async (req, res) => {
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
    
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting Wish Genie products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get a single Wish Genie product
exports.getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = doc(db, 'wish_genie', id);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(200).json({
      id: productDoc.id,
      ...productDoc.data()
    });
  } catch (error) {
    console.error('Error getting Wish Genie product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Create a new Wish Genie product
exports.createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const productsCollection = collection(db, 'wish_genie');
    const productRef = await addDoc(productsCollection, productData);
    
    res.status(201).json({
      id: productRef.id,
      ...productData
    });
  } catch (error) {
    console.error('Error creating Wish Genie product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
};

// Update a Wish Genie product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productRef = doc(db, 'wish_genie', id);
    
    await updateDoc(productRef, {
      ...req.body,
      updatedAt: serverTimestamp()
    });
    
    const updatedDoc = await getDoc(productRef);
    res.status(200).json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    });
  } catch (error) {
    console.error('Error updating Wish Genie product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete a Wish Genie product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteDoc(doc(db, 'wish_genie', id));
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting Wish Genie product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
}; 