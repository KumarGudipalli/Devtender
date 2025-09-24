const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleWare = async (req, res, next) => {
  try {
    console.log(req);
    const cookie = req.cookies;
        console.log(cookie);
    const { token } = cookie;
     console.log(token);
    if (!token) {
      return res.status(401).json({ message: "not authorized" });
    }

    const decodedMessage = await jwt.verify(token, process.env.SECERETKEY);
    const { _id } = decodedMessage;

    const user = await User.findById(_id);
    if (!user) return res.status(400).json({ message: "user not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = authMiddleWare;
