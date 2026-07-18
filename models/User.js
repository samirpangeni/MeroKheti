import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role:{
      type: String,
      enum: ["customer", "farmer", "admin"],
      default: "customer"
    },
    password: {
      type: String,
      required: true,
    },
    suspended:{
      type: Boolean,
      default: false
    },
    suspendedReason:{
      type: String,
      default: ""
    },
    suspendedUntil:{
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);