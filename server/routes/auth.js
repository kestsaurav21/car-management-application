require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");

/**
 * @openapi
 * /auth/user/signup:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - username
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: string
 *                 example: john_doe
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       409:
 *         description: Conflict - Email or username already exists
 *       500:
 *         description: Server error
 */
router.post("/user/signup", async (req, res) => {
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
    const token = jwt.sign({ username, email }, process.env.SECRET);

    return res.status(200).json({
      token,
    });
  } catch (err) {
    console.log("ROUTE: /user/signup - ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @openapi
 * /auth/user/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - password
 *             properties:
 *               userId:
 *                 type: string
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Login success
 *       401:
 *         description: Unauthorized / Invalid Password
 *       500:
 *         description: Server error
 */
router.post("/user/login", async (req, res) => {
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

    const { username, email } = existingUser;

    if (isMatch) {
      // sign token - jwt
      const token = jwt.sign({ username, email }, process.env.SECRET);

      return res.status(200).json({
        token
      });
    } else {
      return res.status(401).json({
        error: "Invalid Password",
      });
    }
  } catch(err) {
    console.log("ROUTE: /user/login - ", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
