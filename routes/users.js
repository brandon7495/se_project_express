const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const authorizeUser = require("../middlewares/auth");
const { validateUserUpdate } = require("../middlewares/validation");

router.use(authorizeUser);

router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateCurrentUser);

module.exports = router;
