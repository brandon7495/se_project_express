const router = require("express").Router();
const { createUser, getUser } = require("../controllers/users");

router.post("/", createUser);
router.get("/:userId", getUser);

module.exports = router;
