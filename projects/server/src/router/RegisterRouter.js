const express = require("express");
const router = express.Router();
const { RegisterController } = require("../controller");

router.post("/", RegisterController.RegisterUser);
router.put("/verify", RegisterController.VerifyUser);

module.exports = router;
