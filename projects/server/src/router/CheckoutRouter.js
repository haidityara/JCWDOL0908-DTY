const express = require("express");
const router = express.Router();
const { CheckoutController } = require("../controller");

router.post("/shipping-cost", CheckoutController.GetShippingCost);

module.exports = router;