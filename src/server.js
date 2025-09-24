const express = require("express");
const dotenv = require("dotenv").config();
require("./config/db");
const SignupRouter = require("./routers/user.rotuer");
const connectToDb = require("./config/db");
const cookieParser = require("cookie-parser");
const ProfileRouter = require("./routers/profile.router");
const requestRouter = require("./routers/request.router");
const feedRouter = require("./routers/feed.router");
const cors = require("cors");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://13.60.199.142/",
    credentials: true,
  })
);

app.use("/api/auth", SignupRouter);
app.use("/api/profile", ProfileRouter);
app.use("/request", requestRouter);
app.use("/connections", feedRouter);
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
