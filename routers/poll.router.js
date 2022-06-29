const express = require("express");
const router = express.Router();
const requestIp = require("request-ip");

const pollController = require("../controllers/poll.controller");

const { validateToken } = require("../middleware");

router.get("/", pollController.getPolls);

router.get("/:pollId", requestIp.mw(), pollController.getPoll);

router.get("/live/:pollId", pollController.getLivePoll);

router.post("/create", validateToken, pollController.createPoll);

module.exports = router;
