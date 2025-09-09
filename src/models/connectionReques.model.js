const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reciverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "intrested", "accept", "reject"],
        message: "`{Value}` is incorrect status type",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.pre("save", function (next) {
  const connectReq = this;
  if (connectReq.senderId.equals(connectReq.reciverId))
    throw new Error("cannot send request to yourSelf !");
  next();
});
const ConnectionRequestModel = new mongoose.model(
  "Connection",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
