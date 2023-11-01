const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/registerUser", userController.registerUser);
router.post("/loginUser", userController.loginUser);
router.post("/logoutUser", userController.logoutUser);
module.exports = router;
