const express = require("express");
const dotEnv =require("dotenv");
const mongoose = require('mongoose');
const vendorRoutes =require('./routes/vendorRoutes');
const bodyparser = require('body-parser');
const firmRoutes =require('./routes/firmRoutes');
const productRoutes =require('./routes/productsRoutes');
 const cors = require('cors');
const path =require('path');

const app = express()
const PORT = process.env.PORT || 408;
app.use(cors());

dotEnv.config();
mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS: 30000})
.then(()=>console.log("MongoDB connected successfully!"))
.catch((error) =>console.log(error))

app.use(bodyparser.json())
app.use('/vendor', vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server started and running on port ${PORT}`);
  });

app.use('/', (req ,res) =>{
    res.send("<h1> Karthik");
})