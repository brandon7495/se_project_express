const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  likeClothingItem,
  unlikeClothingItem,
  deleteClothingItem,
} = require("../controllers/clothingItems");
const authorizeUser = require("../middlewares/auth");

router.get("/", getClothingItems);
router.post("/", authorizeUser, createClothingItem);
router.put("/:itemId/likes", authorizeUser, likeClothingItem);
router.delete("/:itemId/likes", authorizeUser, unlikeClothingItem);
router.delete("/:itemId", authorizeUser, deleteClothingItem);

module.exports = router;
