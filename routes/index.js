const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NotFoundError } = require("../utils/errors");

const { signinUser, createUser } = require("../controllers/users");
const {
  validateUserLogin,
  validateUserRegistration,
} = require("../middlewares/validation");

router.post("/signin", validateUserLogin, signinUser);
router.post("/signup", validateUserRegistration, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((_req, _res, next) => {
  throw new NotFoundError("The requested resource was not found");
});

module.exports = router;
