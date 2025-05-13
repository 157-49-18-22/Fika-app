const express = require('express');
const router = express.Router();
const wishGenieController = require('../controllers/wishGenieController');

// Get all Wish Genie products
router.get('/', wishGenieController.getAllProducts);

// Get a single Wish Genie product
router.get('/:id', wishGenieController.getProduct);

// Create a new Wish Genie product
router.post('/', wishGenieController.createProduct);

// Update a Wish Genie product
router.put('/:id', wishGenieController.updateProduct);

// Delete a Wish Genie product
router.delete('/:id', wishGenieController.deleteProduct);

module.exports = router; 