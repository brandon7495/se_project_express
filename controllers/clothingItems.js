const express = require("express");
const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError("Invalid Item Data"));
      }
      return next(error);
    });
};

const likeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError(`Item Not Found`));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid Item Id"));
      }
      return next(error);
    });
};

const unlikeClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError(`Item Not Found`));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid Item Id"));
      }
      return next(error);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "Item deleted" })
      );
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError(`Item Not Found`));
      }
      if (error.name === "CastError") {
        return next(new BadRequestError("Invalid Item Id"));
      }
      return next(error);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  unlikeClothingItem,
  deleteClothingItem,
};
