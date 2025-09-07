const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  age: { type: Number },
  email: { type: String },
  gender: { type: String },
});

module.exports = mongoose.model("User", userSchema);
