const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

const { validateToken } = require("../middleware");

router.use(validateToken);

router.get("/", userController.getUser);

module.exports = router;
