const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  unlikeClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", unlikeClothingItem);
router.delete("/:itemId", deleteClothingItem);

module.exports = router;
