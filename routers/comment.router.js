const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");

const { validateToken } = require("../middleware");

router.post("/create", validateToken, commentController.createComment);

module.exports = router;
