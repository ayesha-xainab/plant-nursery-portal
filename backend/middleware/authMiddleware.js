const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Support both raw token and "Bearer <token>" header formats
  const raw = typeof token === "string" && token.startsWith("Bearer ") ? token.slice(7) : token;

  try {
    const decoded = jwt.verify(
      raw,
      process.env.JWT_SECRET || "secretKey"
    );

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
