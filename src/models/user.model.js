import mongoose from "mongoose";

// User model to store user information and alert preferences
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: {
    type: String,
    required: true,
  },
  alert: {
    crypto: { type: String, default: "" }, // Cryptocurrency (e.g., 'bitcoin')
    threshold: { type: Number, default: 0 }, // Price threshold (e.g., 40000)
  },
});

export const User = mongoose.model("User", userSchema);
