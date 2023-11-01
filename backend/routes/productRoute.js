const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticatedUser } = require("../middleware/auth");

router.get("/products", authenticatedUser, productController.getAllProducts);
router.get("/products/:id", productController.getSingleProduct);
router.post("/products/new", productController.createProduct);
router.put("/products/:id", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
