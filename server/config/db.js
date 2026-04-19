const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI); // 👈 debug

    await mongoose.connect(process.env.MONGO_URI, {
  family: 4,
});

    console.log("MongoDB Connected ✅");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;