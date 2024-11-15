const jwt = require('jsonwebtoken');
require("dotenv").config();

// Middleware to check if the user is authenticated via JWT
const authenticate = (req, res, next) => {
  // Get token from Authorization header (assuming "Bearer token")
  const token = req.headers['authorization']?.split(' ')[1]; // Split to get token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Verify the token using jsonwebtoken
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Attach the decoded payload (user information) to the request object
    req.user = decoded;  // You can now access `req.user` in your route handlers

    next();  // Proceed to the next middleware or route handler
  });
};

module.exports = authenticate;
