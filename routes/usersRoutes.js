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
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               // Add properties here like name, email, password, etc.
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.post(
  "/api/register",
  // apiController.registerValidation,
  apiController.registerUser
);
router.post("/api/login", apiController.login);
router.post("/api/save_token", apiController.save_token);
router.post("/api/delete_account", apiController.delete_account);
router.get("/api/logout", apiController.logout);
router.post("/api/changePassword", apiController.changePassword);
router.post("/api/fetch_user", apiController.fetchUser);
router.post(
  "/api/update_profile",
  verifyAccessToken,
  apiController.updateProfile
);

// router.get("/api/register", async (req, res) => {
//   try {
//     res.json("register get route");
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// router.get("/api/login", async (req, res) => {
//   try {
//     res.json("login get route");
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
