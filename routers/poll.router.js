const express = require("express");
const router = express.Router();

const pollController = require("../controllers/poll.controller");

const { validateToken } = require("../middleware");

router.get("/", pollController.getPolls);

router.get("/:pollId", pollController.getPoll);

router.get("/live/:pollId", pollController.getLivePoll);

router.post("/create", validateToken, pollController.createPoll);

module.exports = router;
