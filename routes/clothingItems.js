const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  getClothingItem,
  likeClothingItem,
  unlikeClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.get("/:itemId", getClothingItem);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", unlikeClothingItem);
router.delete("/:itemId", deleteClothingItem);

module.exports = router;
