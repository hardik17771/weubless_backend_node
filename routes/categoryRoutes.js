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

router.post("/api/create-shop", apiController.createShop);
router.get("/api/shop-list", apiController.shopListing);
router.put("/api/update-shop", apiController.updateShop);
router.post("/api/shop-details", apiController.shopDetails);

/**** LOCATION FEATURES ROUTES *****/

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

/**** BUY PRODUCTS *****/
router.post("/api/buy-product", apiController.buyProduct);

/**** TRENDING PRODUCTS *****/
router.get("/api/trending-products", apiController.trendingProducts);
router.post(
  "/api/trending-products-by-category",
  apiController.trendingProductsByCategory
);
router.post(
  "/api/trending-products-by-location",
  apiController.trendingProductsByLocation
);

/**** CART *****/
router.post("/api/add-to-cart", apiController.addToCart);
router.get("/api/cart-list", apiController.cartListing);
router.post("/api/cart-details", apiController.cartDetails);
router.post("/api/checkout", apiController.checkout);

/**** CONTACT US *****/
router.post("/api/contact-us", apiController.contactUs);

/**** ADVERTISEMENT *****/
router.post("/api/create-advertisement", apiController.createAdvertisement);
router.get("/api/advertisement-list", apiController.advertisementListing);
router.post(
  "/api/advertisement-list-by-category",
  apiController.advertisementListingByCategory
);
router.post("/api/advertisement-show", apiController.advertisementShow);

module.exports = router;
