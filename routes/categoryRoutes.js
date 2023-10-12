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
router.post("/api/create-sub-category", apiController.createSubCategory);
router.post("/api/main_subcategory", apiController.mainSubCategory);
router.post("/api/create-sub-sub-category", apiController.createSubSubCategory);
router.post("/api/subcategory", apiController.SubCategory);
router.post("/api/create-product", apiController.createProduct);
router.post("/api/product_detail", apiController.productDetails);
// router.post("/api/subcategory", apiController.SubCategory);

module.exports = router;
