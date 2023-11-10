const express = require("express");
const router = express.Router();
const apiController = require("../controllers/APIController");

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

module.exports = router;
