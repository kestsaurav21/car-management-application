const express = require("express");
const router = express.Router();
const { Login, Signup } = require("../controllers/auth");

/**
 * @openapi
 * /auth/user/signup:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - User
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
router.post("/user/signup", Signup);

/**
 * @openapi
 * /auth/user/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - User
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
router.post("/user/login", Login);

module.exports = router;
