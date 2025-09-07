const express = require("express");
const dotenv = require("dotenv").config();
require("./config/db");
const connectToDb = require("./config/db");
const app = express();
const port = process.env.Port;
connectToDb()
  .then(() => {
    console.log(` db is connected`);
    app.listen(port, () => {
      console.log("server is Running on Port - ", port);
    });
  })
  .catch((error) => {
    console.log(`their is an error in connecting to db - `, error.message);
  });
