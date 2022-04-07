const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/local/sign-up", authController.localSignUp);

router.post("/local/sign-in", authController.localSignIn);

router.get("/google/sign-in", authController.googleSignIn);

router.get("/google/callback", authController.googleCallback);

router.get("/facebook/sign-in", authController.facebookSignIn);

router.get("/facebook/callback", authController.facebookCallback);

router.get("/apple/sign-in", authController.appleSignIn);

router.post("/apple/callback", authController.appleCallback);

router.get("/sign-out", authController.logout);

module.exports = router;
