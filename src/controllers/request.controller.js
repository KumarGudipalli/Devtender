const ConnectionRequest = require("../models/connectionReques.model");
const User = require("../models/user.model");

const createRequest = async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.reciverId;
    const status = req.params.status;

    const requriedStatus = ["ignore", "intrested"];
    const isReciverExistsInDb = await User.findById({ _id: fromUserId });

    if (!isReciverExistsInDb)
      return res.status(404).json({ message: "user not found!" });
    if (!requriedStatus.includes(status))
      return res.status(400).json({ message: "invalid status type" });
    const isRequestExisted = await ConnectionRequest.findOne({
      $or: [
        { toUserId, fromUserId },
        { toUserId: fromUserId, fromUserId: toUserId },
      ],
    });
    if (isRequestExisted)
      return res.status(400).json({ message: "request exists already!" });

    const connectRequest = new ConnectionRequest({
      senderId: fromUserId,
      reciverId: toUserId,
      status,
    });

    await connectRequest.save();
    res.status(200).json({
      messge: "connection created Successfully",
      data: connectRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const reveiwRequest = async (req, res) => {
  try {
    const { requestedId, status } = req.params;
    const loggedinUser = req.user;

    const requriedStatus = ["accept", "reject"];

    if (!requriedStatus.includes(status))
      return res.status(400).json({ message: "invalid status type" });

    const connectRequest = await ConnectionRequest.findOne({
      reciverId: loggedinUser._id,
      status: "intrested",
      _id: requestedId,
    });
    if (!connectRequest)
      return res.status(404).json({ message: "connection request not found" });

    connectRequest.status = status;
    await connectRequest.save();
    res.status(200).json({
      messge: "connection accepted Successfully",
      data: connectRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPendingRequests = async (req, res) => {
  try {
    let loggedinUser = req.user;
    const pendingRequests = await ConnectionRequest.find({
      reciverId: loggedinUser._id,
      status: "intrested",
    }).populate("senderId", "firstName lastName profileUrl about skills");
    if (!pendingRequests)
      return res
        .status(200)
        .json({ message: "no pending Requests", pendingRequests: [] });
    res.status(200).json({ pendingRequests });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllConnections = async (req, res) => {
  try {
    let loggedinUser = req.user;

    const userAllConnections = await ConnectionRequest.find({
      $or: [
        { reciverId: loggedinUser._id, status: "accept" },
        { senderId: loggedinUser._id, status: "accept" },
      ],
    })
      .populate("senderId", "firstName lastName profileUrl about skills")
      .populate("reciverId", "firstName lastName profileUrl about skills");

    // Map to always return "the other user"
    const connections = userAllConnections.map((item) => {
      if (item.senderId._id.toString() === loggedinUser._id.toString()) {
        return item.reciverId; // logged-in user was sender, so return receiver
      } else {
        return item.senderId; // logged-in user was receiver, so return sender
      }
    });

    if (!connections.length) {
      return res
        .status(200)
        .json({ message: "no connections yet!", connections: [] });
    }

    res.status(200).json({ connections });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  reveiwRequest,
  getAllPendingRequests,
  getAllConnections,
};
