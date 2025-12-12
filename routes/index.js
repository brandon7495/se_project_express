const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { notFound } = require("../utils/errors");

const { signinUser, createUser } = require("../controllers/users");

router.post("/signin", signinUser);
router.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res
    .status(notFound.status)
    .send({ message: `Requested Resource ${notFound.message}` });
});

module.exports = router;
