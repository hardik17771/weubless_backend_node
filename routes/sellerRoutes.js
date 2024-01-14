const express = require("express");
const router = express.Router();
const apiController = require("../controllers/APIController");


/**
 * @swagger
 * /api/create-seller:
 *   post:
 *     summary: Create a new seller
 *     tags:
 *       - Seller
 *     requestBody:
 *       description: Seller information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userUid:
 *                 type: string
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               user_type:
 *                 type: string
 *               deviceToken:
 *                 type: string
 *               profileImage:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               address:
 *                 type: string
 *               pincode:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               dob:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Seller created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Seller'
 *                 code:
 *                   type: integer
 *                   enum: [764]
 *       '400':
 *         description: Bad Request. Check the response for specific error codes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [1100]
 */
router.post("/api/create-seller", apiController.createSeller);

/**
 * @swagger
 * /api/seller-details:
 *   post:
 *     summary: Get details of a seller
 *     tags:
 *       - Seller
 *     requestBody:
 *       description: Seller information
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seller_id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Seller details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Seller'
 *                 code:
 *                   type: integer
 *                   enum: [766]
 *       '400':
 *         description: Bad Request. Check the response for specific error codes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [765, 761, 1100]
 */
router.post("/api/seller-details", apiController.sellerDetails);


module.exports = router;
