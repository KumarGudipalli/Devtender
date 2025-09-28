require("dotenv").config(); // load .env first
const express = require("express");
const connectToDb = require("./config/db");
const SignupRouter = require("./routers/user.rotuer");
const ProfileRouter = require("./routers/profile.router");
const requestRouter = require("./routers/request.router");
const feedRouter = require("./routers/feed.router");
const chatRouter = require("./routers/chat.rotuer");
const uploadRouter = require("./routers/upload.router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const SocketConnection = require("./socket");
const app = express();
const server = http.createServer(app);
const allowedOrigins = ["http://localhost:5173", "http://13.60.199.142"];

app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use("/auth", SignupRouter);
app.use("/profile", ProfileRouter);
app.use("/request", requestRouter);
app.use("/connections", feedRouter);
app.use("/chat", chatRouter);
app.use("/files", uploadRouter);

const port = process.env.PORT || 5000; // Fix: case-sensitive
SocketConnection(server);
connectToDb()
  .then(() => {
    console.log("DB is connected on backend - " + process.env.MONGODB);
    server.listen(port, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error.message);
  });
