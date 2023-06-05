const express = require("express");
const router = express.Router();
const { ProductController } = require("../controller");

router.get("/", ProductController.GetProducts);

module.exports = router;
