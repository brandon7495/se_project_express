const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("../models/user");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      User.create({ name, avatar, email, password: hashedPassword })
        .then((user) =>
          res.status(201).send({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          })
        )
        .catch((error) => {
          if (error.name === "ValidationError") {
            return next(new BadRequestError("Invalid User Data"));
          }
          if (error.code === 11000) {
            return next(
              new ConflictError("User with this email already exists")
            );
          }
          return next(error);
        });
    })
    .catch((error) => next(error));
};

const getCurrentUser = (req, res, next) => {
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
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError(`User Not Found`));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid User Id"));
      }
      return next(error);
    });
};

const signinUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  return User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((error) => {
      if (error.name === "UnauthorizedError") {
        return next(new UnauthorizedError("Invalid Email or Password"));
      }
      return next(error);
    });
};

const updateCurrentUser = (req, res, next) => {
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
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError(`User Not Found`));
      }
      if (error.name === "ValidationError") {
        return next(new BadRequestError(`Invalid User Data`));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError(`Invalid User Id`));
      }
      return next(error);
    });
};

module.exports = { createUser, getCurrentUser, signinUser, updateCurrentUser };
