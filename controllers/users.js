const User = require("../models/user");
const {
  created,
  invalidUser,
  notFound,
  serverError,
} = require("../utils/constants");
const bcrypt = require("bcryptjs");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.create({ name, avatar, email, password: hashedPassword })
        .then((user) => res.status(created.status).send(user))
        .catch((error) => {
          console.error(error);
          if (error.name === "ValidationError") {
            return res
              .status(invalidUser.status)
              .send({ message: `${invalidUser.message} Data` });
          }
          if (error.code === 11000) {
            return res
              .status(invalidUser.status)
              .send({ message: "User with this email already exists" });
          }
          return res
            .status(serverError.status)
            .send({ message: serverError.message });
        });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(serverError.status)
        .send({ message: "Error hashing password." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(notFound.status)
          .send({ message: `User ${notFound.message}` });
      }
      if (error.name === "CastError") {
        return res
          .status(invalidUser.status)
          .send({ message: `${invalidUser.message} Id` });
      }
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
    });
};

module.exports = { createUser, getUser };
