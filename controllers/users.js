const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  created,
  invalidUser,
  invalidEmailOrPassword,
  notFound,
  serverError,
} = require("../utils/constants");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.create({ name, avatar, email, password: hashedPassword })
        .then((user) =>
          res.status(created.status).send({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          })
        )
        .catch((error) => {
          console.error(error);
          if (error.name === "ValidationError") {
            return res
              .status(invalidUser.status)
              .send({ message: `${invalidUser.message} Data` });
          }
          if (error.code === 11000) {
            return res
              .status(409)
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

const getCurrentUser = (req, res) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) =>
      res.send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
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

const signinUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  return User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((error) => {
      console.error(error);
      if (error.message === invalidEmailOrPassword.message) {
        return res
          .status(invalidEmailOrPassword.status)
          .send({ message: invalidEmailOrPassword.message });
      }
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
    });
};

const updateCurrentUser = (req, res) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) =>
      res.send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(notFound.status)
          .send({ message: `User ${notFound.message}` });
      }
      if (error.name === "ValidationError") {
        return res
          .status(invalidUser.status)
          .send({ message: `${invalidUser.message} Data` });
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

module.exports = { createUser, getCurrentUser, signinUser, updateCurrentUser };
