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
