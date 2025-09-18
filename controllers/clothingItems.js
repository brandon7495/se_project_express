const ClothingItem = require("../models/clothingItem");
const {
  created,
  invalidItem,
  notFound,
  serverError,
} = require("../utils/constants");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((error) => {
      console.error(error);
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
    });
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(created.status).send(item))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res
          .status(invalidItem.status)
          .send({ message: `${invalidItem.message} Data` });
      }
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
    });
};

const likeClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(notFound.status)
          .send({ message: `Item ${notFound.message}` });
      }
      if (error.name === "CastError") {
        return res
          .status(invalidItem.status)
          .send({ message: `${invalidItem.message} Id` });
      }
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
    });
};

const unlikeClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(notFound.status)
          .send({ message: `Item ${notFound.message}` });
      }
      if (error.name === "CastError") {
        return res
          .status(invalidItem.status)
          .send({ message: `${invalidItem.message} Id` });
      }
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.send({ message: "Item deleted", item }))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res
          .status(notFound.status)
          .send({ message: `Item ${notFound.message}` });
      }
      if (error.name === "CastError") {
        return res
          .status(invalidItem.status)
          .send({ message: `${invalidItem.message} Id` });
      }
      return res
        .status(serverError.status)
        .send({ message: serverError.message });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  unlikeClothingItem,
  deleteClothingItem,
};
