const Firm =require('../models/Firm');
const Vendor = require('../models/vendor');
const multer = require('multer');
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

const addFirm =async(req,res)=>{
    try{
        const {firmName ,area,category,region,offer}=req.body;

    const image =req.file?req.file.filename:undefined;
        
    const vendor =await Vendor.findById(req.vendorId);

    if(!vendor){
        res.status(404).json({message:"Vendor not found"})
    }
    if(vendor.firm.length >0){
      return res.status(400).json({message:"vendor can have only one firm"});
    }
    const firm =new Firm ({
        firmName ,area,category,region,offer,image,vendor:vendor._id
    })

    const savedFirm =await firm.save();
    const firmId = savedFirm._id;
    vendor.firm.push(savedFirm)

    await vendor.save()


    return res.status(200).json({message:'Firm Added successfully',firmId})

    }catch(error){
            console.log(error)
            res.status(500).json("internal server error")
    }
}

const deleteFirmById = async(req,res) =>{
  try{
    const firmId =req.params.firmId;
    const deletedProduct = await Firm.findByIdAndDelete(firmId);
    if(!deletedProduct){
      return res.status(404).json({error:"No product found"})
    }
  }catch(error){
    console.error("Error in addProduct:", error);
res.status(500).json({ error: "Internal server error" });
  }


}

module.exports ={addFirm: [upload.single('image'),addFirm],deleteFirmById}