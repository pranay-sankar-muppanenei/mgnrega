const mongoose  =require("mongoose");
const dotenv =require("dotenv");
const fs=require("fs");
const Performance =require("../models/Performance.js");

dotenv.config();

const seedData = async () => {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // 2. Read JSON file
    const data = JSON.parse(fs.readFileSync("./data/mgnrega.json", "utf-8"));

    // 3. Clean the collection (optional but recommended)
    await Performance.deleteMany({});
    console.log("🧹 Cleared existing data");

    // 4. Insert new data
    await Performance.insertMany(data);
    console.log(`📊 Inserted ${data.length} records successfully`);

    // 5. Close connection
    await mongoose.connection.close();
    console.log("✅ Seeding completed & MongoDB connection closed");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
