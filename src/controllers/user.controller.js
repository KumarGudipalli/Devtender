const User = require("../models/user.model");
const { validatior } = require("../utils/validation");
const bcrypt = require("bcrypt");

const Signup = async (req, res) => {
  try {
    validatior(req);
    const {
      firstName,
      lastName,
      password,
      email,
      gender,
      age,
      skills,
      profileUrl,
      about,
    } = req.body;
    let existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "user exists already" });

    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      password: hashedpassword,
      email,
      gender,
      age,
      skills,
      profileUrl,
      about,
    });

    await user.save();

    res.status(200).json({ message: "user is created successfully" });
  } catch (error) {
    res.status(400).send({ message: `ERROR: ${error.message}` });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) return res.status(400).json({ message: "user not found" });
    let dcryptpassword = await user.validatePassword(password);
    if (!dcryptpassword) {
      return res.status(400).json({ message: "invalid password" });
    }

    const jwtToken = await user.getJwt();
    if (jwtToken)
      res.cookie("token", jwtToken, {
        httpOnly: true,
        secure: true, // only true if using https
        sameSite: "none",
      });
    res
      .status(201)
      .json({ message: "user loggedin Successfully ", data: user });
  } catch (error) {
    res.status(400).json({ message: "somthing went wrong" });
  }
};

module.exports = { Signup, Login };
