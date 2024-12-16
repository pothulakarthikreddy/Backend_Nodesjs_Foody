const Product = require("../models/Product");
const multer =require("multer");
const Firm =require('../models/Firm');
const path = require('path');
const mongoose = require('mongoose');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory where files will be saved
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with a unique name
    }
  });
  
  // Initialize multer
  const upload = multer({ storage: storage });

 
  const firmSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // other fields...
});
  

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const firmId = req.params.firmId;

    // Validate firmId
    if (!firmId || !mongoose.Types.ObjectId.isValid(firmId)) {
      return res.status(400).json({ error: "Invalid firm ID" });
    }

    // Validate product data
    if (!productName || !price) {
      return res.status(400).json({ error: "Product name and price are required" });
    }

    // Validate category (ensure it's an array)
    const productCategories = Array.isArray(category) ? category : [category];

    // Validate image upload
    const image = req.file ? req.file.filename : undefined;

    // Find the firm by ID
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    // Create a new product instance
    const product = new Product({
      productName,
      price,
      category: productCategories,
      bestseller: bestseller || false,
      description,
      image,
      firm: firm._id,
    });

    // Save the new product to the database
    const savedProduct = await product.save();

    // Add the new product to the firm's products
    firm.products.push(savedProduct._id);

    // Save the updated firm document
    await firm.save();

    // Respond with the saved product
    res.status(200).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error in addProduct:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

  


// Ensure mongoose is imported

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    // Validate firmId
    if (!firmId || !mongoose.Types.ObjectId.isValid(firmId)) {
      return res.status(400).json({ error: "Invalid or missing Firm ID" });
    }

    // Find the firm by ID
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    // Retrieve products for the firm
    const products = await Product.find({ firm: firmId });

    // Respond with the firm's name and products
    res.status(200).json({
      restaurantName: firm.firmName,
      products,
    });
  } catch (error) {
    console.error("Error in getProductByFirm:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const deleteProductById = async(req,res) =>{
      try{
        const productId =req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
          return res.status(404).json({error:"No product found"})
        }
      }catch(error){
        console.error("Error in addProduct:", error);
    res.status(500).json({ error: "Internal server error" });
      }


}

module.exports = {addProduct :[upload.single('image'),addProduct], getProductByFirm ,deleteProductById};