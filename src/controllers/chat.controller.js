const Chat = require("../models/chat.model");
const Message = require("../models/message.model");
const User = require("../models/user.model");

// 1. Create or get a one-to-one chat
const accessChat = async (req, res) => {
  try {
    const { toUserId } = req.params; // target user id
    const loggedInUser = req.user._id;

    if (!toUserId) {
      return res.status(400).json({ message: "userId required" });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [loggedInUser, toUserId] },
    })
      .populate("participants", "firstName lastName profileUrl")
      .populate({
        path: "messages",
        populate: {
          path: "senderId",
          select: "firstName lastName profileUrl",
        },
      });

    if (!chat) {
      // create new
      chat = await Chat.create({
        participants: [loggedInUser, toUserId],
      });
      chat = await Chat.findById(chat._id).populate(
        "participants",
        "firstName lastName profileUrl"
      );
    }

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Send a message
const sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const senderId = req.user._id;

    if (!chatId || !content) {
      return res.status(400).json({ message: "chatId and content required" });
    }

    const newMessage = await Message.create({
      chatId,
      senderId,
      content,
      imageUrl
    });

    // Push message into Chat
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: newMessage._id },
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "firstName lastName profileUrl")
      .populate("chatId", "participants");

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get all messages in a chat
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({ chatId })
      .populate("senderId", "firstName lastName profileUrl")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get all chats of a user
const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId,
    })
      .populate("participants", "firstName lastName profileUrl")
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // latest message
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  accessChat,
  sendMessage,
  getMessages,
  getUserChats,
};
