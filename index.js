const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productsRoutes");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 408;

// CORS configuration
const corsOptions = {
  origin: [
    "https://react-foody-backend-dashboard.vercel.app"
    
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Parse JSON request bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.set("debug", true);
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 30000 })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.log("MongoDB connection error:", error));

// Define routes
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"));

// Default route
app.get("/", (req, res) => {
  res.send("<h1>Karthik</h1>");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started and running on port ${PORT}`);
});
