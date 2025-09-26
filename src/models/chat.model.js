const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    // isGroupChat: {
    //   type: Boolean,
    //   default: false,
    // },
    // chatName: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
