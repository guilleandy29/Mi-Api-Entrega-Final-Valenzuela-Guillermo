import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // ✅ carga variables de .env

const MONGO_URL = process.env.MONGO_URL;
console.log("🔍 MONGO_URL:", MONGO_URL);

try {
  await mongoose.connect(MONGO_URL);
  console.log("✅ Conectado a MongoDB");
} catch (error) {
  console.error("❌ MongoDB connection error", error);
}