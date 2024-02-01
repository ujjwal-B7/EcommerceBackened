const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { authenticatedUser, authorizedRoles } = require("../middleware/auth");

router.get("/products", productController.getAllProducts);
router.get(
  "/admin/products",
  authenticatedUser,
  authorizedRoles("admin"),
  productController.getAllProductsByAdmin
);
router.get("/products/:id", productController.getSingleProduct);
router.post(
  "/admin/products/new",
  authenticatedUser,
  authorizedRoles("admin"),
  productController.createProduct
);

// router.put(
//   "/admin/products/:id",
//   authenticatedUser,
//   authorizedRoles("admin"),
//   productController.updateProduct
// );
// router.delete(
//   "/admin/products/:id",
//   authenticatedUser,
//   authorizedRoles("admin"),
//   productController.deleteProduct
// );
router
  .route("/admin/products/:id")
  .put(
    authenticatedUser,
    authorizedRoles("admin"),
    productController.updateProduct
  )
  .delete(
    authenticatedUser,
    authorizedRoles("admin"),
    productController.deleteProduct
  );

router.put(
  "/products/review",
  authenticatedUser,
  productController.createProductReview
);
router.get("/products/review/:id", productController.getAllProductsReview);
router.delete(
  "/products/review/delete/:id",
  authenticatedUser,
  productController.deleteProductsReview
);
module.exports = router;
