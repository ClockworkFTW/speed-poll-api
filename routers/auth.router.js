const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/local/login", authController.localLogin);

router.get("/google/login", authController.googleLogin);

router.get("/google/callback", authController.googleCallback);

router.get("/facebook/login", authController.facebookLogin);

router.get("/facebook/callback", authController.facebookCallback);

router.get("/apple/login", authController.appleLogin);

router.post("/apple/callback", authController.appleCallback);

router.get("/logout", authController.logout);

module.exports = router;
