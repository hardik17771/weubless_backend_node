const express = require("express");
// const {validationResult} = require('express-validator')
const router = express.Router();
// const { createUser, getAllUsers } = require("../controllers/UserController");
const authenticate = require("../middleware/Authenticate");
const AuthController = require("../controllers/AuthController");
const PasswordResetController = require("../controllers/API/V2/PasswordResetController");
const apiController = require("../controllers/APIController");
const verifyAccessToken = require("../middleware/VerifyAccessToken");

// v2/auth routes
// router.post("/v2/auth/login", AuthController.login);
// router.post("/v2/auth/signup", AuthController.signup);
// router.post("/v2/auth/social-login", AuthController.socialLogin);
// router.post(
//   "/v2/auth/password/forget_request",
//   PasswordResetController.forgetRequest
// );
// router.post(
//   "/v2/auth/password/confirm_reset",
//   PasswordResetController.confirmReset
// );
// router.post(
//   "/v2/auth/password/resend_code",
//   PasswordResetController.resendCode
// );
// router.post(
//   "/v2/auth/password/PasswordChange",
//   PasswordResetController.passwordChange
// );

// router.post("/v2/auth/resend_code", AuthController.resendCode);
// router.post("/v2/auth/confirm_code", AuthController.confirmCode);
// router.post("/v2/auth/verify_phone", AuthController.verify_phone);

// router.use("/v2/auth", authenticate); // Assuming authenticate is your authentication middleware

// router.get("/v2/auth/logout", AuthController.logout);
// router.get("/v2/auth/user", AuthController.user);

// Middleware for the routes under /api
// router.use("/api", authenticate); // Assuming authenticate is your authentication middleware

/**
 * @swagger
 * /api/add-address:
 *   post:
 *     summary: Create a new address
 *     tags:
 *       - Address
 *     requestBody:
 *       description: Address data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               userUid:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
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
 *             required:
 *               - user_id
 *               - latitude
 *               - longitude
 *               # Add other required fields here
 *     responses:
 *       200:
 *         description: Address created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       719:
 *         description: Latitude is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                 message:
 *                   type: string
 *       730:
 *         description: Longitude is required or other validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: number
 *                 message:
 *                   type: string
 */
router.post("/api/add-address", apiController.createAddress);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       description: User data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               country_code:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               user_type:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                 message:
 *                   type: string
 */
router.post("/api/register", apiController.registerUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 country_code:
 *                   type: string
 *                 email:
 *                   type: string
 *                 access_token:
 *                   type: string
 *                 code:
 *                   type: integer
 *                   enum: [200]
 *       430:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [430]
 *       461:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [461]
 *       531:
 *         description: Empty email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [531]
 *       532:
 *         description: Empty password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [532]
 *       468:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [468]
 */

router.post("/api/login", apiController.login);

/**
 * @swagger
 * /api/changePassword:
 *   post:
 *     summary: Change user password
 *     tags:
 *       - User
 *     requestBody:
 *       description: User email, current password, new password, phone, and country code
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               country_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [200]
 *       411:
 *         description: User not found or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [411]
 *       420:
 *         description: New password is the same as the old password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [420]
 *       468:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [468]
 */
router.post("/api/changePassword", apiController.changePassword);

/**
 * @swagger
 * /api/fetch_user:
 *   post:
 *     summary: Fetch user details by user ID
 *     tags:
 *       - User
 *     requestBody:
 *       description: User ID
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: number
 *               userUid :
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               dob:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               liveAddress:
 *                 type: string
 *               livePincode:
 *                 type: string
 *               liveCity:
 *                 type: string
 *               input_latitude:
 *                 type: string
 *               input_longitude:
 *                 type: string
 *               input_liveAddress:
 *                 type: string
 *               input_livePincode:
 *                 type: string
 *               input_liveCity:
 *                 type: string
 *               input_deviceToken:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             properties:
 *               user_id :
 *                 type: number
 *               userUid :
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               dob:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               liveAddress:
 *                 type: string
 *               livePincode:
 *                 type: string
 *               liveCity:
 *                 type: string
 *               input_latitude:
 *                 type: string
 *               input_longitude:
 *                 type: string
 *               input_liveAddress:
 *                 type: string
 *               input_livePincode:
 *                 type: string
 *               input_liveCity:
 *                 type: string
 *               input_deviceToken:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 code:
 *                   type: integer
 *                   enum: [200]
 *       422:
 *         description: User not found or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [422]
 *       468:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [468]
 */
router.post("/api/fetch_user", apiController.fetchUser);

/**
 * @swagger
 * /api/update_profile:
 *   post:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User profile information to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *             properties:
 *               user_id :
 *                 type: number
 *               userUid :
 *                 type: string
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               dob:
 *                 type: string
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               liveAddress:
 *                 type: string
 *               livePincode:
 *                 type: string
 *               liveCity:
 *                 type: string
 *               input_latitude:
 *                 type: string
 *               input_longitude:
 *                 type: string
 *               input_liveAddress:
 *                 type: string
 *               input_livePincode:
 *                 type: string
 *               input_liveCity:
 *                 type: string
 *               input_deviceToken:
 *                 type: string
 *               profileImage:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 code:
 *                   type: integer
 *                   enum: [200]
 *       422:
 *         description: User not found or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [422]
 *       468:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   enum: [468]
 */
router.post(
  "/api/update_profile",
  // verifyAccessToken,
  apiController.updateProfile
);

// Yet to be tested
router.post("/api/save_token", apiController.save_token);
router.post("/api/delete_account", apiController.delete_account);
router.get("/api/logout", apiController.logout);

module.exports = router;
