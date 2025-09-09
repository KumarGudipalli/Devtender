const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  password: { type: String, required: true },
  age: { type: Number },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  gender: { type: String },
  profileUrl: { type: String },
  skills: { type: [String], default: [] },
  about: { type: String },
});

userSchema.methods.getJwt = async function () {
  user = this;

  const jwtToken = await jwt.sign({ _id: user.id }, process.env?.SECERETKEY, {
    expiresIn: "1d",
  });

  return jwtToken;
};

userSchema.methods.validatePassword = function (passwordByInput) {
  user = this;
  const hashedpassword = user.password;
  const isPasswordValid = bcrypt.compare(passwordByInput, hashedpassword);
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
