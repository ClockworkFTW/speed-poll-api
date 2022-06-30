const express = require("express");
const router = express.Router();
const requestIp = require("request-ip");

const voteController = require("../controllers/vote.controller");

router.post("/create", requestIp.mw(), voteController.createVote);

module.exports = router;
