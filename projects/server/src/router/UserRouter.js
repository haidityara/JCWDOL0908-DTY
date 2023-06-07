const express = require("express");
const router = express.Router();
const { UserController, AddressController } = require("../controller");

router.get("/", UserController.GetUser);
router.post("/address", AddressController.StoreAddress);
router.put("/address/default", AddressController.MakeAddressPrimary);
router.patch("/address/:id_address", AddressController.UpdateAddress);
router.get("/address", AddressController.GetAddress);

module.exports = router;
