const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const authorizeUser = require("../middlewares/auth");

router.use(authorizeUser);

router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentUser); // Placeholder for update profile

module.exports = router;
