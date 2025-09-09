const ConnectionRequest = require("../models/connectionReques.model");
const userModel = require("../models/user.model");

const showUsersinFeed = async (req, res) => {
  try {
    const loggedinUser = req.user;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let skip = (page - 1) * limit;
    limit = limit > 40 ? 40 : limit;
    const connectionRequested = await ConnectionRequest.find({
      $or: [
        {
          senderId: loggedinUser._id,
        },
        { reciverId: loggedinUser._id },
      ],
    }).select("senderId reciverId");

    const set = new Set();
    connectionRequested.map((item) => {
      set.add(item.senderId), set.add(item.reciverId);
    });
    const FeedUsers = await userModel
      .find({
        $and: [
          { _id: { $nin: Array.from(set) } },
          { _id: { $ne: loggedinUser._id } },
        ],
      })
      .skip(skip)
      .limit(limit);

    res.status(200).send({ FeedUsers });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = showUsersinFeed;
