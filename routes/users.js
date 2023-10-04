const express = require("express");
const router = express.Router();
// const { createUser, getAllUsers } = require("../controllers/UserController");
const authenticate = require("../middlewares/authenticate");
const AuthController = require("../controllers/AuthController");

// v2/auth routes
router.post("/v2/auth/login", AuthController.login);
router.post("/v2/auth/signup", AuthController.signup);
router.post("/v2/auth/social-login", AuthController.socialLogin);
router.post(
  "/v2/auth/password/forget_request",
  PasswordResetController.forgetRequest
);
router.post(
  "/v2/auth/password/confirm_reset",
  PasswordResetController.confirmReset
);
router.post(
  "/v2/auth/password/resend_code",
  PasswordResetController.resendCode
);
router.post(
  "/v2/auth/password/PasswordChange",
  PasswordResetController.PasswordChange
);

router.post("/v2/auth/resend_code", AuthController.resendCode);
router.post("/v2/auth/confirm_code", AuthController.confirmCode);
router.post("/v2/auth/verify_phone", AuthController.verify_phone);

router.use("/v2/auth", authenticate); // Assuming authenticate is your authentication middleware

router.get("/v2/auth/logout", AuthController.logout);
router.get("/v2/auth/user", AuthController.user);

// Middleware for the routes under /api
router.use("/api", authenticate); // Assuming authenticate is your authentication middleware

router.post("/api/register", apiController.register);
router.post("/api/login", apiController.login);
router.post("/api/save_token", apiController.save_token);
router.post("/api/delete_account", apiController.delete_account);
router.get("/api/logout", apiController.logout);
router.post("/api/changePassword", apiController.changePassword);

module.exports = router;
