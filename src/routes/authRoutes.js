const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");
const validationMiddleware = require("../middlewares/validationMiddleware");

const { registerValidation, loginValidation, forgotPasswordValidation, resetPasswordValidation } = require("../validations/authValidation");
const { loginLimiter, forgotPasswordLimiter } = require("../middlewares/rateLimiterMiddleware");

router.post("/register", validationMiddleware(registerValidation), authController.register);
router.post("/login", loginLimiter, validationMiddleware(loginValidation), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authMiddleware, authController.logout);
router.get("/me", authMiddleware, authController.me);
router.get("/verify", authController.verifyAccount);
router.post("/forgot-password", forgotPasswordLimiter, validationMiddleware(forgotPasswordValidation), authController.forgotPassword);
router.post("/reset-password", validationMiddleware(resetPasswordValidation), authController.resetPassword);

module.exports = router;
