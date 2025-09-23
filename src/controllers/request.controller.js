const ConnectionRequest = require("../models/connectionReques.model");
const User = require("../models/user.model");

const createRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const reciverId = req.params.reciverId;
    const status = req.params.status;

    const requriedStatus = ["ignore", "intrested"];
    const isReciverExistsInDb = await User.findById({ _id: reciverId });

    if (!isReciverExistsInDb)
      return res.status(404).json({ message: "user not found!" });
    if (!requriedStatus.includes(status))
      return res.status(400).json({ message: "invalid status type" });
    const isRequestExisted = await ConnectionRequest.findOne({
      $or: [
        { senderId, reciverId },
        { senderId: reciverId, reciverId: senderId },
      ],
    });
    if (isRequestExisted)
      return res.status(400).json({ message: "request exists already!" });

    const connectRequest = new ConnectionRequest({
      senderId,
      reciverId,
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
      status: "accept",
      $or: [{ reciverId: loggedinUser._id }, { senderId: loggedinUser._id }],
    })
      .populate("senderId", "firstName lastName profileUrl  about  skills")
      .populate("reciverId", "firstName lastName profileUrl about  skills");
    if (!userAllConnections)
      return res
        .status(200)
        .json({ message: "no connected yet !", userAllConnections: [] });
    res.status(200).json({ userAllConnections });
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
