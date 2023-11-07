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

/**** PRODUCT ROUTES *****/

/**
 * @swagger
 * /api/create-product:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Product
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Product information (Only Required fields are mentioned here rest fields can also be added by looking at the schema and category_id shall not be given since it is autopopulated using the subcategory)
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             main_subcategory_id:
 *               type: number
 *             shop_id:
 *               type: number
 *     responses:
 *       716:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *                 code:
 *                   type: integer
 *                   enum: [716]
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
 *       723:
 *         description: Shop ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [723]
 *       725:
 *         description: Main Subcategory ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [725]
 *       726:
 *         description: Subcategory with provided main_subcategory_id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [726]
 */
router.post("/api/create-product", apiController.createProduct);

/**
 * @swagger
 * /api/product-list:
 *   get:
 *     summary: Get a list of products
 *     tags:
 *       - Product
 *     responses:
 *       732:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 code:
 *                   type: integer
 *                   enum: [732]
 *       425:
 *         description: Error retrieving product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 */
router.get("/api/product-list", apiController.productListing);

/**
 * @swagger
 * /api/update-product:
 *   put:
 *     summary: Update a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Updated product information(D0 not change/update Category Id since updating the main_subcategory_id automatically updates the category ID)
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             product_id:
 *               type: number
 *     responses:
 *       297:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [297]
 *                 updatedProduct:
 *                   $ref: '#/components/schemas/Product'
 *       425:
 *         description: Error updating product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 *       718:
 *         description: Product ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [718]
 *       722:
 *         description: Shop with provided shop_id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [722]
 *       726:
 *         description: Subcategory with provided main_subcategory_id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [726]
 */
router.put("/api/update-product", apiController.updateProduct);

/**
 * @swagger
 * /api/product-details:
 *   post:
 *     summary: Get details of a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Product information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             product_id:
 *               type: number
 *     responses:
 *       664:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     name: { type: string }
 *                     createdAt: { type: string, format: date-time }
 *                     updatedAt: { type: string, format: date-time }
 *                     product_id: { type: number }
 *                     main_subcategory_id: { type: number }
 *                     subcategory_id: { type: number }
 *                     latitude: { type: string }
 *                     longitude: { type: string }
 *                     quantity: { type: number }
 *                     added_by: { type: string }
 *                     user_id: { type: string }
 *                     category_id: { type: number }
 *                     brand_id: { type: string }
 *                     photos: { type: string }
 *                     thumbnail_img: { type: string }
 *                     featured_img: { type: string }
 *                     flash_deal_img: { type: string }
 *                     video_provider: { type: string }
 *                     video_link: { type: string }
 *                     tags: { type: string }
 *                     description: { type: string }
 *                     unit_price: { type: number }
 *                     purchase_price: { type: number }
 *                     choice_options: { type: string }
 *                     colors: { type: string }
 *                     variations: { type: string }
 *                     todays_deal: { type: number }
 *                     published: { type: number }
 *                     featured: { type: number }
 *                     current_stock: { type: number }
 *                     unit: { type: string }
 *                     discount: { type: number }
 *                     discount_type: { type: string }
 *                     tax: { type: number }
 *                     tax_type: { type: string }
 *                     shipping_type: { type: string }
 *                     shipping_cost: { type: number }
 *                     num_of_sale: { type: number }
 *                     meta_title: { type: string }
 *                     meta_description: { type: string }
 *                     meta_img: { type: string }
 *                     pdf: { type: string }
 *                     slug: { type: string }
 *                     rating: { type: number }
 *                 code:
 *                   type: integer
 *                   enum: [664]
 *       422:
 *         description: Product with provided product_id does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [422]
 *       718:
 *         description: Product ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [718]
 *       642:
 *         description: Error retrieving product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [642]
 */
router.post("/api/product-details", apiController.productDetails);

/**** FETCHING PRODUCTS FROM IDs ROUTES *****/

/**
 * @swagger
 * /api/products-category-id:
 *   post:
 *     summary: Get products by category ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Category ID information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             category_id:
 *               type: number
 *     responses:
 *       684:
 *         description: Products retrieved successfully by category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [684]
 *                 productsList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *       729:
 *         description: No products found for the provided category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [729]
 *                 productsList:
 *                   type: array
 *                   items: {}
 *       642:
 *         description: Error retrieving products by category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [642]
 */
router.post("/api/products-category-id", apiController.productsFromCategoryId);

/**
 * @swagger
 * /api/products-main-subcategory-id:
 *   post:
 *     summary: Get products by main subcategory ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Main subcategory ID information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             main_subcategory_id:
 *               type: number
 *     responses:
 *       684:
 *         description: Products retrieved successfully by main subcategory ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [684]
 *                 productsList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *       728:
 *         description: No products found for the provided main subcategory ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [728]
 *                 productsList:
 *                   type: array
 *                   items: {}
 *       642:
 *         description: Error retrieving products by main subcategory ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [642]
 */
router.post(
  "/api/products-main-subcategory-id",
  apiController.productsFromMainSubCategoryId
);

/**** SHOP ROUTES *****/

/**
 * @swagger
 * /api/create-shop:
 *   post:
 *     summary: Create a new shop
 *     tags:
 *       - Shop
 *     parameters:
 *       - in: body
 *         name: shop
 *         description: Shop information(only required parameters mentioned here rest can be seen from the schemas)
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             latitude:
 *               type: string
 *             longitude:
 *               type: string
 *     responses:
 *       720:
 *         description: Shop created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Shop'
 *                 code:
 *                   type: integer
 *                   enum: [720]
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
 *       719:
 *         description: Latitude or longitude is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [719]
 *       721:
 *         description: Error creating shop
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [721]
 */
router.post("/api/create-shop", apiController.createShop);

/**
 * @swagger
 * /api/shop-list:
 *   get:
 *     summary: Get a list of shops
 *     tags:
 *       - Shop
 *     responses:
 *       733:
 *         description: List of shops retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shop'
 *                 code:
 *                   type: integer
 *                   enum: [733]
 *       425:
 *         description: Error retrieving shop list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 */
router.get("/api/shop-list", apiController.shopListing);

/**
 * @swagger
 * /api/update-shop:
 *   put:
 *     summary: Update a shop
 *     tags:
 *       - Shop
 *     requestBody:
 *       description: Data to update the shop
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop_id:
 *                 type: integer
 *                 description: The ID of the shop to be updated
 *               name:
 *                 type: string
 *                 description: The updated name of the shop
 *               latitude:
 *                 type: string
 *                 description: The updated latitude of the shop
 *               longitude:
 *                 type: string
 *                 description: The updated longitude of the shop
 *             required:
 *               - shop_id
 *     responses:
 *       297:
 *         description: Shop updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [297]
 *                 updatedShop:
 *                   $ref: '#/components/schemas/Shop'
 *       425:
 *         description: Error updating shop
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 *       723:
 *         description: Missing shop ID in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [723]
 */
router.put("/api/update-shop", apiController.updateShop);

/**
 * @swagger
 * /api/shop-details:
 *   post:
 *     summary: Get details of a shop
 *     tags:
 *       - Shop
 *     requestBody:
 *       description: Data to get shop details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop_id:
 *                 type: string
 *                 description: The ID of the shop to get details for
 *             required:
 *               - shop_id
 *     responses:
 *       667:
 *         description: Shop details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [667]
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     shop_id:
 *                       type: integer
 *                     latitude:
 *                       type: string
 *                     longitude:
 *                       type: string
 *                     productsList:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product_id:
 *                             type: number
 *                           product_name:
 *                             type: string
 *       722:
 *         description: Shop not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [722]
 *       723:
 *         description: Missing shop ID in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [723]
 *       724:
 *         description: Error retrieving shop details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [724]
 */
router.post("/api/shop-details", apiController.shopDetails);

/**** LOCATION FEATURES ROUTES *****/

/**
 * @swagger
 * /api/main-subcategoryproductLocation:
 *   post:
 *     summary: Get products based on user , shop , and main subcategory location
 *     tags:
 *       - Products By Location
 *     parameters :
 *       - in: body
 *         name: data
 *         description : Data to retrieve products based on distance between the user and the shop of the particular subCategory that is entered
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             shop_id:
 *               type: string
 *             user_id:
 *               type: string
 *             main_subcategory_id:
 *               type: string
 *           required:
 *             - shop_id
 *             - user_id
 *             - main_subcategory_id
 *     responses:
 *       900:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [900]
 *                 productsList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *       722:
 *         description: Shop not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [722]
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [404]
 *       726:
 *         description: Main subcategory not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [726]
 *       723:
 *         description: Missing shop ID in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [723]
 *       730:
 *         description: Missing user ID in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [730]
 */
router.post(
  "/api/main-subcategoryproductLocation",
  apiController.main_subcategoryproductLocation
);

/**
 * @swagger
 * /api/main-subcategoryproductDistance:
 *   post:
 *     summary: Get products based on distance from a specified location
 *     tags:
 *       - Products By Location
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Data to retrieve products based on distance given; returns the products within the distance of the lat long provided by the user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             distance:
 *               type: number
 *             main_subcategory_id:
 *               type: string
 *             latitude:
 *               type: string
 *             longitude:
 *               type: string
 *           required:
 *             - distance
 *             - main_subcategory_id
 *             - latitude
 *             - longitude
 *     responses:
 *       900:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [900]
 *                 productsList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *       726:
 *         description: Main subcategory not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [726]
 *       719:
 *         description: Missing latitude and/or longitude in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [719]
 *       731:
 *         description: Missing distance in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [731]
 */
router.post(
  "/api/main-subcategoryproductDistance",
  apiController.main_subcategoryproductDistance
);

/**
 * @swagger
 * /api/main-subcategoryproductLatLong:
 *   post:
 *     summary: Get products within a specific distance using latitude and longitude
 *     tags:
 *       - Products By Location
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Returns the list of the products within the given set of lat and long provided by the user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             lat1:
 *               type: string
 *             long1:
 *               type: string
 *             lat2:
 *               type: string
 *             long2:
 *               type: string
 *             main_subcategory_id:
 *               type: number
 *     responses:
 *       900:
 *         description: List of products within the specified distance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [900]
 *                 productsList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *       719:
 *         description: Missing required fields (lat1, long1, lat2, long2)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [719]
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
 *       726:
 *         description: Invalid main_subcategory_id provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [726]
 */
router.post(
  "/api/main-subcategoryproductLatLong",
  apiController.main_subcategoryproductLatLong
);

/**
 * @swagger
 * /api/main-subcategoryproductUserDistance:
 *   post:
 *     summary: Get products within a specific distance from a user using user_id and main_subcategory_id
 *     tags:
 *       - Products By Location
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Returns the products within the distance of the user that is being provided
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user_id:
 *               type: string
 *             main_subcategory_id:
 *               type: number
 *             distance:
 *               type: number
 *     responses:
 *       900:
 *         description: List of products within the specified distance from the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [900]
 *                 productsList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: number
 *                       product_name:
 *                         type: string
 *       725:
 *         description: Missing user_id, main_subcategory_id, or distance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [725]
 *       726:
 *         description: Invalid main_subcategory_id or user_id provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [726]
 *       730:
 *         description: Missing user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [730]
 *       731:
 *         description: Missing distance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [731]
 */
router.post(
  "/api/main-subcategoryproductUserDistance",
  apiController.main_subcategoryproductUserDistance
);

/**** BUY PRODUCTS *****/

/**
 * @swagger
 * /api/buy-product:
 *   post:
 *     summary: Buy a product
 *     tags:
 *       - Buy Product
 *     parameters:
 *       - in: body
 *         name: data
 *         description: User buys a product
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             product_id:
 *               type: string
 *             user_id:
 *               type: string
 *     responses:
 *       900:
 *         description: Product purchased successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [900]
 *       718:
 *         description: Missing product_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [718]
 *       730:
 *         description: Missing user_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [730]
 *       734:
 *         description: Product is out of stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [734]
 *       735:
 *         description: Invalid product_id provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [735]
 *       461:
 *         description: Invalid user_id or product_id provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [461]
 *       425:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 */
router.post("/api/buy-product", apiController.buyProduct);

/**** TRENDING PRODUCTS *****/
/**
 * @swagger
 * /api/trending-products:
 *   get:
 *     summary: Get trending products
 *     tags:
 *       - Trending Products
 *     responses:
 *       732:
 *         description: List of trending products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productsList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 code:
 *                   type: integer
 *                   enum: [732]
 *       425:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 *       default:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 */
router.get("/api/trending-products", apiController.trendingProducts);

/**
 * @swagger
 * /api/trending-products-by-category:
 *   post:
 *     summary: Get trending products by category
 *     tags:
 *       - Trending Products
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Category information (Only Required fields are mentioned here)
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             category_id:
 *               type: number
 *     responses:
 *       732:
 *         description: List of trending products by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productsList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 code:
 *                   type: integer
 *                   enum: [732]
 *       711:
 *         description: Missing or invalid category ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [711]
 *       default:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 */
router.post(
  "/api/trending-products-by-category",
  apiController.trendingProductsByCategory
);

/**
 * @swagger
 * /api/trending-products-by-location:
 *   post:
 *     summary: Get trending products by location
 *     tags:
 *       - Trending Products
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Return trending products within the distance of the lat long provided
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             latitude:
 *               type: string
 *             longitude:
 *               type: string
 *             distance:
 *               type: number
 *     responses:
 *       732:
 *         description: List of trending products by location
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productsList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 code:
 *                   type: integer
 *                   enum: [732]
 *       719:
 *         description: Missing latitude or longitude
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [719]
 *       731:
 *         description: Missing or invalid distance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [731]
 *       default:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 */
router.post(
  "/api/trending-products-by-location",
  apiController.trendingProductsByLocation
);

/**** CART *****/

/**
 * @swagger
 * /api/add-to-cart:
 *   post:
 *     summary: Add a product to the user's cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Information required to add a product to the cart (Only Required fields are mentioned here)
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             product_id:
 *               type: number
 *             user_id:
 *               type: string
 *             quantity:
 *               type: number
 *             category_id:
 *               type: number
 *     responses:
 *       669:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 amount:
 *                   type: number
 *                 productsList:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 code:
 *                   type: integer
 *                   enum: [669]
 *       740:
 *         description: Insufficient quantity in stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [740]
 *       741:
 *         description: Invalid category for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [741]
 *       718:
 *         description: Missing product_id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [718]
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
 *       730:
 *         description: Missing user_id or quantity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [730]
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [404]
 *       735:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [735]
 */
router.post("/api/add-to-cart", apiController.addToCart);

/**
 * @swagger
 * /api/cart-list:
 *   get:
 *     summary: Get a list of items in the user's cart
 *     tags:
 *       - Cart
 *     responses:
 *       742:
 *         description: List of items in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cart'
 *                 code:
 *                   type: integer
 *                   enum: [742]
 *       425:
 *         description: Error fetching cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [425]
 */
router.get("/api/cart-list", apiController.cartListing);

/**
 * @swagger
 * /api/cart-details:
 *   post:
 *     summary: Get details of a specific cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Object containing the cart_id
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             cart_id:
 *               type: integer
 *     responses:
 *       671:
 *         description: Details of the requested cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 code:
 *                   type: integer
 *                   enum: [671]
 *       738:
 *         description: Cart with provided ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [738]
 *       739:
 *         description: Missing cart_id in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [739]
 *       1100:
 *         description: Error fetching cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [1100]
 */
router.post("/api/cart-details", apiController.cartDetails);

/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Process checkout for a cart
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Object containing the cart_id
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             cart_id:
 *               type: integer
 *     responses:
 *       683:
 *         description: Cart successfully checked out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [683]
 *       738:
 *         description: Cart with provided ID not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [738]
 *       739:
 *         description: Missing cart_id in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [739]
 *       670:
 *         description: Error processing checkout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [670]
 */
router.post("/api/checkout", apiController.checkout);

/**** CONTACT US *****/

/**
 * @swagger
 * /api/contact-us:
 *   post:
 *     summary: Submit a contact inquiry
 *     tags:
 *       - Contact
 *     requestBody:
 *       description: Contact information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact inquiry submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: ["1"]
 *                 message:
 *                   type: string
 *                 data:
 *                   type: string
 *       400:
 *         description: Error in sending email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: ["0"]
 *                 message:
 *                   type: string
 *       500:
 *         description: Error saving contact inquiry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: ["0"]
 *                 message:
 *                   type: string
 */
router.post("/api/contact-us", apiController.contactUs);

/**** ADVERTISEMENT *****/

/**
 * @swagger
 * /api/create-advertisement:
 *   post:
 *     summary: Create a new advertisement
 *     tags:
 *       - Advertisement
 *     requestBody:
 *       description: Advertisement information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: New advertisement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Advertisement'
 *                 code:
 *                   type: integer
 *                   example: 743
 *       400:
 *         description: Missing name or category_id in request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 708
 *       404:
 *         description: Category with specified category_id not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 714
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 1100
 */
router.post("/api/create-advertisement", apiController.createAdvertisement);

/**
 * @swagger
 * /api/advertisement-list:
 *   get:
 *     summary: Get a list of advertisements
 *     tags:
 *       - Advertisement
 *     responses:
 *       200:
 *         description: List of advertisements retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Advertisement'
 *                 code:
 *                   type: integer
 *                   example: 678
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 425
 */
router.get("/api/advertisement-list", apiController.advertisementListing);

/**
 * @swagger
 * /api/advertisement-list-by-category:
 *   post:
 *     summary: Get a list of advertisements by category
 *     tags:
 *       - Advertisement
 *     parameters:
 *       - in: body
 *         name: data
 *         description: Category information
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             category_id:
 *               type: number
 *               description: ID of the category
 *     responses:
 *       200:
 *         description: List of advertisements by category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Advertisement'
 *                 code:
 *                   type: integer
 *                   example: 678
 *       400:
 *         description: Bad request, missing or invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 711
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 425
 */
router.post(
  "/api/advertisement-list-by-category",
  apiController.advertisementListingByCategory
);

// router.post("/api/advertisement-show", apiController.advertisementShow);

module.exports = router;
