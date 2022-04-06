const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

const { validateToken } = require("../middleware");

router.get("/", validateToken, userController.getUser);

module.exports = router;
