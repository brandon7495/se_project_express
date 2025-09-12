const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { notFound } = require("../utils/constants");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res
    .status(notFound.status)
    .send({ message: `Requested Resource ${  notFound.message}` });
});

module.exports = router;
