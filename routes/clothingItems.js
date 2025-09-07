const router = require("express").Router();
const {
  getItems,
  createItem,
  getItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.get("/:itemId", getItem);

module.exports = router;
