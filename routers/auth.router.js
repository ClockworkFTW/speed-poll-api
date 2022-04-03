const express = require("express");
const router = express.Router();

const { passport } = require("../index");
const authController = require("../controllers/auth.controller");

router.post(
  "/local",
  passport.authenticate("local", { failureRedirect: "/login" }),
  authController.local
);

router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.google
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  authController.facebook
);

router.get("/apple", passport.authenticate("apple"));

router.post(
  "/apple/callback",
  passport.authenticate("apple", { failureRedirect: "/login" }),
  authController.apple
);

module.exports = router;
