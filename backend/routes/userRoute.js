const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticatedUser, authorizedRoles } = require("../middleware/auth");

router.post("/registerUser", userController.registerUser);
router.post("/loginUser", userController.loginUser);
router.post("/forgotPassword", userController.forgotPassword);
router.put("/resetPassword/:token", userController.resetPassword);
router.put("/updatePassword", authenticatedUser, userController.updatePassword);
router.post("/logoutUser", userController.logoutUser);
router.get("/users", authenticatedUser, userController.getUserDetail);
module.exports = router;
