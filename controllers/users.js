const User = require("../models/user");
const {
  created,
  invalidUser,
  notFound,
  serverError,
} = require("../utils/constants");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(created.status).send(user))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(invalidUser.status)
          .send({ message: `${invalidUser.message} Data` });
      }
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
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
      } else if (error.name === "CastError") {
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
