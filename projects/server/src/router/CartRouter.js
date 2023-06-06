const express = require("express");
const router = express.Router();
const { CartController } = require("../controller");

router.post("/add", CartController.AddToCart);
router.delete("/:id_product/remove", CartController.RemoveFromCart);
router.get("/", CartController.GetCart);

module.exports = router;
