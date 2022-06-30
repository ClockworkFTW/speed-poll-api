const { models } = require("../models");

const geolocationService = require("../services/geolocation");

exports.createVote = async (req, res) => {
  try {
    // Extract request data
    const ip = req.clientIp;
    const { pollId, votes } = req.body;

    // Check to make sure option was selected
    if (votes.length === 0) {
      return res.status(400).json("Please select an option.");
    }

    // Get geolocation data from ip address
    const { country, countryCode } = await geolocationService.getLocation(ip);

    // Create votes
    await Promise.all(
      votes.map(
        async (optionId) =>
          await models.Vote.create({ ip, country, countryCode, optionId })
      )
    );

    // Retrieve constructed poll
    const poll = await models.Poll.getOne(req.models, pollId);

    res.json({ poll });
  } catch (error) {
    console.log("createVote", error.name);
    res.status(400).json("Could not cast vote.");
  }
};
