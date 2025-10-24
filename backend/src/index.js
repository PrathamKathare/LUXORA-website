import mongoose from "mongoose";
import { app } from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8000;
const DB_URI = process.env.MONGO_URI;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });