const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");
const authorizeUser = require("../middlewares/auth");

router.use(authorizeUser);

router.get("/me", getCurrentUser);

module.exports = router;
