const { models } = require("../models");

const geolocationService = require("../services/geolocation");

exports.castVote = async (req, res) => {
  try {
    // Extract request data
    const ip = req.clientIp;
    const { uuid } = req.body;

    const { country } = await geolocationService.getLocation(ip);

    const option = await models.Option.findOne({ where: { uuid } });

    await models.Vote.create({ ip, country, optionId: option.id });

    // Retrieve poll with user and options
    const poll = await models.Poll.findOne({
      where: { id: option.pollId },
      include: [
        { model: models.User, as: "user", attributes: ["username"] },
        {
          model: models.Option,
          as: "options",
          attributes: ["uuid", "content"],
          include: [
            { model: models.Vote, as: "votes", attributes: ["country"] },
          ],
        },
      ],
      nest: true,
    });

    res.json({ poll });
  } catch (error) {
    console.log(error);
    res.status(400).json("Could not cast vote.");
  }
};
