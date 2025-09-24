require("dotenv").config();  // load .env first
const express = require("express");
const connectToDb = require("./config/db");
const SignupRouter = require("./routers/user.rotuer");
const ProfileRouter = require("./routers/profile.router");
const requestRouter = require("./routers/request.router");
const feedRouter = require("./routers/feed.router");
const cookieParser = require("cookie-parser");
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

app.use("/auth", SignupRouter);
app.use("/profile", ProfileRouter);
app.use("/request", requestRouter);
app.use("/connections", feedRouter);

const port = process.env.PORT || 5000;  // Fix: case-sensitive

connectToDb()
  .then(() => {
    console.log("DB is connected on backend - " +  process.env.MONGODB);
    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error.message);
  });
