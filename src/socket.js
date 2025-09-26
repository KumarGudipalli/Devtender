const { Server } = require("socket.io");
const crypto = require("crypto");
const { findById } = require("./models/user.model");
const Chat = require("./models/chat.model.js");
const Message = require("./models/message.model");

const cryptoHashing = (to, from) => {
  return crypto
    .createHash("sha256")
    .update([to, from].sort().join("_"))
    .digest("hex");
};
const SocketConnection = (server) => {
  const allowedOrigins = ["http://localhost:5173", "http://13.60.199.142"];

  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // Join private chat room
    socket.on("joinChat", ({ firstName, lastName, targetId, userId }) => {
      const roomId = cryptoHashing(userId, targetId);
      console.log(`✅ ${firstName} joined room:`, roomId);
      socket.join(roomId);
    });
    socket.on("sendMessage", async ({ firstName,lastName, targetId, userId, text }) => {
      try {
        let chat = await Chat.findOne({
          participants: { $all: [targetId, userId] },
        });

        if (!chat) {
          chat = new Chat({ participants: [userId, targetId], messages: [] });
          await chat.save();
        }

        // create message in Message collection
        const newMessage = await Message.create({
          chatId: chat._id,
          senderId: userId,
          content: text,
        });

        // add message ref to chat
        chat.messages.push(newMessage._id);
        await chat.save();

        const roomId = cryptoHashing(userId, targetId);
        io.to(roomId).emit("messageReceived", { firstName, text, lastName });
      } catch (error) {
        console.error("❌ Error sending message:", error.message);
      }
    });

    socket.on("disconnect", () => {});
  });

  return io;
};

module.exports = SocketConnection;
