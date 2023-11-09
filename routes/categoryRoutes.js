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

/**** CATEGORY ROUTES *****/

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
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               required: true  # This makes 'name' field required
 *             image:
 *               type: string
 *               required: true  # This makes 'image' field required
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
 *           required:
 *             - name
 *             - image
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

/**
 * @swagger
 * /api/update-category:
 *   put:
 *     summary: Update a category by ID
 *     tags:
 *       - Category
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Updated category information
 *         schema:
 *           type: object
 *           properties:
 *             category_id:
 *               type: integer
 *               required: true
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
 *       297:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [297]
 *                 updatedCategory:
 *                   $ref: '#/components/schemas/Category'
 *       425:
 *         description: Error updating category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 *       711:
 *         description: Missing category_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [711]
 */
router.put("/api/update-category", apiController.updateCategory);

/**** SUB CATEGORY ROUTES *****/

/**
 * @swagger
 * /api/create-subcategory:
 *   post:
 *     summary: Create a new subcategory
 *     tags:
 *       - SubCategory
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Subcategory information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             category_id:
 *               type: integer
 *     responses:
 *       712:
 *         description: Subcategory created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SubCategory'
 *                 code:
 *                   type: integer
 *                   enum: [712]
 *       710:
 *         description: Name is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [710]
 *       711:
 *         description: Category ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [711]
 *       713:
 *         description: Error creating subcategory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [713]
 *       714:
 *         description: Category with provided category_id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [714]
 */
router.post("/api/create-subcategory", apiController.createSubCategory);

/**
 * @swagger
 * /api/subcategory-list:
 *   get:
 *     summary: Get a list of subcategories
 *     tags:
 *       - SubCategory
 *     responses:
 *       690:
 *         description: List of subcategories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SubCategory'
 *                 code:
 *                   type: integer
 *                   enum: [690]
 *       425:
 *         description: Error retrieving subcategory list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 */
router.get("/api/subcategory-list", apiController.subCategoryListing);

/**
 * @swagger
 * /api/update-subcategory:
 *   put:
 *     summary: Update a subcategory by main_subcategory_id
 *     tags:
 *       - SubCategory
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Updated subcategory information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             main_subcategory_id:
 *               type: integer
 *     responses:
 *       297:
 *         description: Subcategory updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [297]
 *                 updatedSubCategory:
 *                   $ref: '#/components/schemas/SubCategory'
 *       425:
 *         description: Error updating subcategory
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 *       714:
 *         description: Category with provided category_id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [714]
 *       725:
 *         description: Missing main_subcategory_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [725]
 */
router.put("/api/update-subcategory", apiController.updateSubCategory);

/**
 * @swagger
 * /api/main_subcategory:
 *   post:
 *     summary: Get main subcategories by category ID
 *     tags:
 *       - SubCategory
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Category information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             category_id:
 *               type: integer
 *     responses:
 *       689:
 *         description: List of main subcategories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [689]
 *                 subCategoriesList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       main_subcategory_id:
 *                         type: integer
 *                       main_subcategory:
 *                         type: string
 *       715:
 *         description: No main subcategories found for the given category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [715]
 *                 subCategoriesList:
 *                   type: array
 *                   items: {}
 *       642:
 *         description: Error retrieving main subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [642]
 */
router.post("/api/main_subcategory", apiController.mainSubCategory);

// router.post("/api/create-sub-sub-category", apiController.createSubSubCategory);
// router.post("/api/subcategory", apiController.SubCategory);

// router.post("/api/advertisement-show", apiController.advertisementShow);

module.exports = router;
