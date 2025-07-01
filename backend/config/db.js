const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then(() => console.log("MongoDB connected"))
        .catch((error) => console.error("MongoDB connection error:", error));
};

// MongoDB connection

module.exports = connectDB;
