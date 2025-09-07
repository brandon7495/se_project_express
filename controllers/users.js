const User = require("../models/user");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: error.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      return res.status(500).send({ message: error.message });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "User not found" });
      } else if (error.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID" });
      }
      return res.status(500).send({ message: error.message });
    });
};

module.exports = { getUsers, createUser, getUser };
