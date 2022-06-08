import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: String,
  hashedPassword: String,
  credentials: Array,
});

const User = mongoose.model("User", userSchema);

export default User;
