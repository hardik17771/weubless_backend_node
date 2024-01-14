const express = require("express");
const router = express.Router();
const apiController = require("../controllers/APIController");

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
 * /api/add-products-to-shop:
 *   post:
 *     summary: Add products to a shop
 *     tags:
 *       - Shop
 *     requestBody:
 *       description: Shop and product information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shop_id:
 *                 type: number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     shop_price:
 *                       type: number
 *     responses:
 *       '200':
 *         description: Products added to the shop successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Shop'
 *                 code:
 *                   type: integer
 *                   enum: [763]
 *       '400':
 *         description: Bad Request. Check the response for specific error codes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [718, 723, 756]
 *       '500':
 *         description: Internal Server Error. Check the response for specific error codes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [721]
 */
router.post("/api/add-products-to-shop", apiController.addProductsToShop);


/**
 * @swagger
 * /api/delete-product-of-shop:
 *   post:
 *     summary: Delete a product from a shop
 *     tags:
 *       - Shop
 *     requestBody:
 *       description: Shop and product information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: number
 *               shop_id:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Product deleted from the shop successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     shop:
 *                       $ref: '#/components/schemas/Shop'
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                 code:
 *                   type: integer
 *                   enum: [767]
 *       '400':
 *         description: Bad Request. Check the response for specific error codes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [718, 723, 722, 735]
 *       '500':
 *         description: Internal Server Error. Check the response for specific error codes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [721]
 */
router.post("/api/delete-product-of-shop", apiController.deleteProductOfShop);

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

/**
 * @swagger
 * /api/shop-by-categoryid:
 *   post:
 *     summary: Get shops by category ID
 *     tags:
 *       - Shop
 *     requestBody:
 *       description: Data to get shops by category ID
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: number
 *                 description: The ID of the category to filter shops
 *             required:
 *               - category_id
 *     responses:
 *       900:
 *         description: Shops retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [900]
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       latitude:
 *                         type: string
 *                       longitude:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       shop_id:
 *                         type: integer
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *       711:
 *         description: Missing category ID in the request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [711]
 *       724:
 *         description: Error retrieving shops by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [724]
 */
router.post("/api/shop-by-categoryid", apiController.getShopsByCategory);

module.exports = router;
