const Product = require("../models/Product");
const multer =require("multer");
const Firm =require('../models/Firm');
const path = require('path');

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


  const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmId;

        const firm = await Firm.findById(firmId);

        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        // Create a new product instance
        const product = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id,
        });

        // Save the new product to the database
        const savedProduct = await product.save();

        // Ensure firm.products is initialized as an array
        if (!Array.isArray(firm.products)) {
            firm.products = [];
        }

        // Add the new product to the firm's products
        firm.products.push(savedProduct._id); // Push only the product ID

        // Save the updated firm document
        await firm.save();

        // Respond with the saved product
        res.status(200).json(savedProduct);
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getProductByFirm = async(req,res) =>{
  try{
    const firmId =req.params.firmId;
    const firm = await Firm.findById(firmId);
    
    if(!firm){
      return res.status(404).json({error:"NO firm found"});
    }
    const restaurantName = firm.firmName;
        const products =await Product.find({firm:firmId});
        res.status(200).json({restaurantName,products});

  }catch(error){
    console.error("Error in addProduct:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

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