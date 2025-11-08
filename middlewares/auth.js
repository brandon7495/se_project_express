const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const authorizeUser = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

module.exports = authorizeUser;
