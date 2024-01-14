const express = require("express");
const router = express.Router();
const apiController = require("../controllers/APIController");

/**** CART *****/

/**
 * @swagger
 * /api/add-to-cart:
 *   post:
 *     summary: Add products to the user's shopping cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       description: Object containing user information and products to be added to the cart
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_id:
 *                 type: number
 *               product_id:
 *                 type: number
 *               user_id:
 *                 type: number
 *               userUid:
 *                 type: string
 *               category_id:
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
 *                       default: 0
 *                     shop_id:
 *                       type: number
 *               price:
 *                 type: number
 *                 default: 0
 *               tax:
 *                 type: number
 *                 default: 0
 *               quantity:
 *                 type: number
 *                 default: 0
 *               amount:
 *                 type: number
 *                 default: 0
 *             required:
 *               - user_id
 *               - userUid
 *               - category_id
 *               - products
 *             additionalProperties: false
 *     responses:
 *       '200':
 *         description: Products added to the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 code:
 *                   type: number
 *       '404':
 *         description: User not found or invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 */
router.post("/api/add-to-cart", apiController.addToCart);


/**
 * @swagger
 * /api/place-order:
 *   post:
 *     summary: Place an order for the products in the user's cart
 *     tags:
 *       - Order
 *     requestBody:
 *       description: Object containing user information and cart details for placing an order
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: number
 *               user_id:
 *                 type: number
 *               userUid:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                       default: 0
 *                     shop_id:
 *                       type: number
 *               cart_id:
 *                 type: number
 *               total_amount:
 *                 type: number
 *                 default: 0
 *               status:
 *                 type: string
 *             required:
 *               - user_id
 *               - userUid
 *             additionalProperties: false
 *     responses:
 *       '200':
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 code:
 *                   type: number
 *       '404':
 *         description: User or cart not found, or invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 */
router.post("/api/place-order", apiController.placeOrder);


/**
 * @swagger
 * /api/order-complete:
 *   post:
 *     summary: Mark an order as completed
 *     tags:
 *       - Order
 *     requestBody:
 *       description: Object containing order ID for marking the order as completed
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               order_id:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Order marked as completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 code:
 *                   type: number
 *       '404':
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 */
router.post("/api/order-complete", apiController.completeOrder);

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
// router.post("/api/checkout", apiController.checkout);

module.exports = router;
