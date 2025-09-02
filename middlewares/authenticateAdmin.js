const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Allow role 1 (super admin) and 2 (moderator)
    if (!decoded || (decoded.role !== 1 && decoded.role !== 2)) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
