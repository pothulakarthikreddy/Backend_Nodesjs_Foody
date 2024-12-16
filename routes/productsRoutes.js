const express = require('express');
const productController = require('../controllers/productController');
const path = require('path'); // Import the 'path' module

const router = express.Router();

// Add a product to a specific firm
router.post('/add-product/:firmId', productController.addProduct);

// Get products for a specific firm
router.get('/:firmId/products', productController.getProductByFirm);

// Serve uploaded images
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;

    // Set the appropriate content type for the image
    res.set('Content-Type', 'image/jpeg');

    // Send the image file from the uploads directory
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName), (err) => {
        if (err) {
            console.error(err);
            res.status(404).send({ error: 'Image not found' });
        }
    });
});

// Delete a product by its ID
router.delete('/:productId', productController.deleteProductById);

// Fallback error handler
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});

module.exports = router;
