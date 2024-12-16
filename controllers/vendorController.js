

const Vendor = require('../models/vendor');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotEnv = require('dotenv');


dotEnv.config();
const secretkey =process.env.WhatIsYourName;

const vendorRegister =async(req,res) =>{
    const {username,email,password} =req.body;

    try{
        const vendorEmail =await Vendor.findOne({email});
        if(vendorEmail){
            return res.status(400).json("Email already taken");

        }
        const hashedPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            username,
            email,
            password:hashedPassword
        });
        await newVendor.save();

        res.status(201).json({message: "Vendor registered succeessfully"});
        console.log('registered')

    }catch(error){
        console.error(error);
        res.status(500).json({error:"Internal server error"})

    }

}

const vendorLogin =async(req,res)=>{
    const{email,password} =req.body;
    try{

        const vendor =await Vendor.findOne({email});
        if(!vendor|| !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"Invalid username or password"})
        }

        const token = jwt.sign({ vendorId: vendor._id},secretkey,{expiresIn:"1h"})

        const vendorId = vendor._id

        res.status(200).json({success:"Login successful" ,token,vendorId})
        console.log(email,"this is token",token);
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }

}

const getAllVendors =async(req,res) =>{
    try{
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors})
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Internal server error"});
    }
}

const getVendorById = async (req, res) => {
  const vendorId = req.params.id;

  try {
    if (!vendorId) {
      return res.status(400).json({ error: 'Vendor ID is required' });
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const skip = req.query.skip ? parseInt(req.query.skip, 10) : null;

    if (limit !== null && isNaN(limit)) {
      return res.status(400).json({ error: 'Invalid limit value' });
    }

    if (skip !== null && isNaN(skip)) {
      return res.status(400).json({ error: 'Invalid skip value' });
    }

    // Create options object dynamically
    const options = {};
    if (limit) options.limit = limit;
    if (skip) options.skip = skip;

    const vendor = await Vendor.findById(vendorId).populate({
      path: 'firm',
      options,
    });

    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    const vendorFirmId = vendor.firm && vendor.firm.length > 0 ? vendor.firm[0]._id : null; ;
    

    if (!vendorFirmId) {
      return res.status(404).json({ error: 'Vendor has no associated firm' });
    }

    res.status(200).json({ vendorId, vendorFirmId ,vendor });

  } catch (error) {
    console.error('Error fetching vendor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports ={vendorRegister,vendorLogin, getAllVendors,getVendorById}
