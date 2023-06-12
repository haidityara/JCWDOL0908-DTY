const express = require("express");
const router = express.Router();
const { RegisterController, AuthController } = require("../controller");
const UserMiddleware = require("../middleware/UserMiddleware");

router.post("/register", RegisterController.RegisterUser);
router.put("/verify", RegisterController.VerifyUser);
router.post("/", AuthController.AuthUser);
router.get("/keep-login", UserMiddleware.CheckAuth, AuthController.KeepLogin);

module.exports = router;
