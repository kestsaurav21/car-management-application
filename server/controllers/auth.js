require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const Signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const existingUserEmail = await User.findOne({ email });

    if (existingUserEmail) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const existingUserName = await User.findOne({ username });

    if (existingUserName) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    // sign token - jwt
    const token = jwt.sign({ userId: newUser._id, username, email }, process.env.SECRET);

    return res.status(200).json({
      token,
    });
  } catch (err) {
    console.log("ROUTE: /user/signup - ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const Login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: userId }, { username: userId }],
    });

    if (!existingUser) {
      return res.status(408).json({
        error: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    const { _id, username, email } = existingUser;

    if (isMatch) {
      // sign token - jwt
      const token = jwt.sign({ userId: _id, username, email }, process.env.SECRET);

      return res.status(200).json({
        token,
      });
    } else {
      return res.status(401).json({
        error: "Invalid Password",
      });
    }
  } catch (err) {
    console.log("ROUTE: /user/login - ", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
    Signup,
    Login
}
