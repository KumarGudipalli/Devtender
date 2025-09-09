const { validateFieldsToUpdate } = require("../utils/validation");

const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const udpateProfile = async (req, res) => {
  try {
    const user = req.user;

    if (!validateFieldsToUpdate(req)) {
      return res.status(400).json({ message: "this fields are not update" });
    }
    Object.keys(req.body).map((item) => (user[item] = req.body[item]));
    await user.save();
    res
      .status(200)
      .json({ message: "fileds udpated successfully", updatedUser: user });
  } catch (error) {
    res.status(500).json({ message: "somthing went wrong!" });
  }
};

module.exports = { getProfile, udpateProfile };
