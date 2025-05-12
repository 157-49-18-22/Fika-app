const axios = require('axios');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1VcZovJeaKiScSJhEuT3dWtSenvjFUj8",
  authDomain: "fika-3865e.firebaseapp.com",
  projectId: "fika-3865e",
  storageBucket: "fika-3865e.firebasestorage.app",
  messagingSenderId: "616823581929",
  appId: "1:616823581929:web:ee8c44165a656f78485478"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateProducts() {
  try {
    // Fetch products from the API
    const response = await axios.get('http://13.202.119.111:5000/api/products');
    const products = response.data;

    console.log(`Found ${products.length} products to migrate`);

    // Store each product in Firestore
    for (const product of products) {
      const productRef = doc(db, 'products', product.product_code);
      await setDoc(productRef, {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Migrated product: ${product.product_name}`);
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

// Run the migration
migrateProducts(); 