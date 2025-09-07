const Item = require("../models/Item");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: error.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  console.log(req.user._id); // Temporary log to verify owner

  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(400).send({ message: error.message });
      }
      return res.status(500).send({ message: error.message });
    });
};

const getItem = (req, res) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((error) => {
      console.error(error);
      if (error.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      } else if (error.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID" });
      }
      return res.status(500).send({ message: error.message });
    });
};

module.exports = { getItems, createItem, getItem };
