const axios = require('axios');
const admin = require('firebase-admin');
const path = require('path');

// Update this path to your actual service account key file
const serviceAccount = require(path.join(__dirname, '../config/serviceAccountKey.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function syncProductsToFirestore() {
  try {
    const response = await axios.get('http://13.202.119.111:5000/api/products');
    const products = response.data;
    for (const product of products) {
      await db.collection('products').doc(String(product.id)).set(product);
      console.log(`Saved product ${product.id}`);
    }
    console.log('All products synced to Firestore!');
  } catch (error) {
    console.error('Error syncing products:', error);
  }
}

// Run directly if called from CLI
if (require.main === module) {
  syncProductsToFirestore();
}

module.exports = { syncProductsToFirestore }; 