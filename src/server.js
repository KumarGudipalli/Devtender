import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.Port;
app.listen(port, () => {
  console.log("server is Running on Port - ", port);
});
