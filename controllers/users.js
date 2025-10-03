const User = require("../models/user");
const {
  created,
  invalidUser,
  invalidEmail,
  invalidPassword,
  notFound,
  serverError,
} = require("../utils/constants");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

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

const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((error) => {
      console.error(error);
      if (error.message === "Invalid email") {
        return res
          .status(invalidEmail.status)
          .send({ message: invalidEmail.message });
      }
      if (error.message === "Invalid password") {
        return res
          .status(invalidPassword.status)
          .send({ message: invalidPassword.message });
      }
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
    });
};

module.exports = { createUser, getUser, loginUser };
