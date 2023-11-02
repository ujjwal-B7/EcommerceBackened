const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticatedUser } = require("../middleware/auth");

router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getSingleProduct);
router.post(
  "/products/new",
  authenticatedUser,
  productController.createProduct
);
router.put("/products/:id", authenticatedUser, productController.updateProduct);
router.delete(
  "/products/:id",
  authenticatedUser,
  productController.deleteProduct
);

module.exports = router;
