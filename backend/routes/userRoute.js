const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticatedUser, authorizedRoles } = require("../middleware/auth");

router.post("/registerUser", userController.registerUser);
router.post("/loginUser", userController.loginUser);
router.post("/forgotPassword", userController.forgotPassword);
router.put("/resetPassword/:token", userController.resetPassword);
router.put("/updatePassword", authenticatedUser, userController.updatePassword);
router.put("/updateProfile", authenticatedUser, userController.updateProfile);
router.post("/logoutUser", userController.logoutUser);
router.get("/user", authenticatedUser, userController.getUserDetail);
router.get(
  "/admin/getAllUsers",
  authenticatedUser,
  authorizedRoles("admin"),
  userController.getAllUsers
);
router.get(
  "/admin/getSingleUserByAdmin/:id",
  authenticatedUser,
  authorizedRoles("admin"),
  userController.getSingleUserByAdmin
);
router.put(
  "/admin/updateUserRole/:id",
  authenticatedUser,
  authorizedRoles("admin"),
  userController.updateUserRole
);
router.get(
  "/admin/deleteUser/:id",
  authenticatedUser,
  authorizedRoles("admin"),
  userController.deleteUser
);
module.exports = router;
