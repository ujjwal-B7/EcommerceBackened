const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticatedUser, authorizedRoles } = require("../middleware/auth");

router.get(
  "/products",

  productController.getAllProducts
);
router.get("/products/:id", productController.getSingleProduct);
router.post(
  "/products/new",
  authenticatedUser,
  authorizedRoles("admin"),
  productController.createProduct
);
router.put(
  "/products/:id",
  authenticatedUser,
  authorizedRoles("admin"),
  productController.updateProduct
);
router.delete(
  "/products/:id",
  authenticatedUser,
  authorizedRoles("admin"),
  productController.deleteProduct
);

module.exports = router;
