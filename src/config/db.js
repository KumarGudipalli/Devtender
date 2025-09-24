const mongoose = require("mongoose");

const connectToDb = async () => {
  await mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports =   connectToDb
