const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {UnauthorizedError} = require("../utils/errors");

const authorizeUser = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("Authorization required");
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw new UnauthorizedError("Invalid or expired token");
    }
    return next(error);
  }
};

module.exports = authorizeUser;
