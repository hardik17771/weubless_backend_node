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
router.post("/api/sub-category", apiController.createSubCategory);
router.post("/api/main_subcategory", apiController.mainSubCategory);

module.exports = router;
