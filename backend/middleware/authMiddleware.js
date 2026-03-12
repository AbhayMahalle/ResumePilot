const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Read the Authorization header
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Extract the token
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded userId to request object
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
