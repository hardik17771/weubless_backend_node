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

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: Get a list of categories
 *     tags:
 *       - Category
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.get("/api/category", categoryListingMiddleware);

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Category
 *     parameters:
 *       - in: body
 *         name: category
 *         description: Category information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             image:
 *               type: string
 *             banner:
 *               type: string
 *             icon:
 *               type: string
 *             featured:
 *               type: integer
 *             top:
 *               type: integer
 *             subCategories:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubCategory'
 *     responses:
 *       706:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *                 code:
 *                   type: integer
 *                   enum: [706]
 *       708:
 *         description: Name is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [708]
 *       709:
 *         description: Image is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [709]
 *       707:
 *         description: Error creating category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [707]
 */
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
