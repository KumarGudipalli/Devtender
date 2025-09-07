const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose.connect(process.env.MONGODB);
};

module.exports =   connectToDb
