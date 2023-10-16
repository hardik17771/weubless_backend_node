const express = require("express");
const router = express.Router();
const apiController = require("../controllers/APIController");

const categoryListingMiddleware = async (req, res, next) => {
  //   try {
  const response = await apiController.categoryListing(req, res);
  res.json(response);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
};

router.get("/api/category", categoryListingMiddleware);
router.post("/api/category", apiController.createCategory);
router.post("/api/create-subcategory", apiController.createSubCategory);
router.post("/api/main_subcategory", apiController.mainSubCategory);
router.post("/api/create-sub-sub-category", apiController.createSubSubCategory);
router.post("/api/subcategory", apiController.SubCategory);
router.post("/api/create-product", apiController.createProduct);
router.post("/api/product-details", apiController.productDetails);
router.post(
  "/api/products-subCategoryId",
  apiController.productsFromSubCategoryId
);

// router.post(
//   "/api/fetch-product-from-main-subcategory",
//   apiController.fetchProductFromMainSubCategory
// );

router.post("/api/create-shop", apiController.createShop);
router.post("/api/shop-details", apiController.shopDetails);
// router.post("/api/subcategory", apiController.SubCategory);

router.post(
  "/api/main-subcategoryproductLocation",
  apiController.main_subcategoryproductLocation
);

router.post(
  "/api/main-subcategoryproductDistance",
  apiController.main_subcategoryproductDistance
);

router.post(
  "/api/main-subcategoryproductLatLong",
  apiController.main_subcategoryproductLatLong
);

router.post(
  "/api/main-subcategoryproductUserDistance",
  apiController.main_subcategoryproductUserDistance
);

module.exports = router;
