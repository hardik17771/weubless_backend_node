const express = require("express");
const router = express.Router();
const apiController = require("../controllers/APIController");

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

module.exports = router;
