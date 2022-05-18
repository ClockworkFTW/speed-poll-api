const express = require("express");
const router = express.Router();

const requestIp = require("request-ip");

const voteController = require("../controllers/vote.controller");

router.post("/cast", requestIp.mw(), voteController.castVote);

module.exports = router;
