const express = require("express");
const {
  accessChat,
  sendMessage,
  getMessages,
  getUserChats,
} = require("../controllers/chat.controller");
const authMiddleWare = require("../middleware/auth");


const router = express.Router();

// Create or get a one-to-one chat
router.get("/getChat/:toUserId", authMiddleWare, accessChat);

// Send message
router.post("/message", authMiddleWare, sendMessage);

// Get all messages in a chat
router.get("/messages/:chatId", authMiddleWare, getMessages);

// Get all chats of logged-in user
router.get("/chats", authMiddleWare, getUserChats);

module.exports = router;
