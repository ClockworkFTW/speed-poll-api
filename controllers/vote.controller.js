const { models } = require("../models");

const geolocationService = require("../services/geolocation");

exports.castVotes = async (req, res) => {
  try {
    // Extract request data
    const ip = req.clientIp;
    const { pollId, votes } = req.body;

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
    console.log(error);
    res.status(400).json("Could not cast vote.");
  }
};
