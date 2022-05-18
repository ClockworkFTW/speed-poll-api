const { models } = require("../models");

exports.getPolls = async (req, res) => {
  try {
    const polls = await models.Poll.findAll({
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
    });

    res.json({ polls });
  } catch (error) {
    console.log(error);
    res.status(400).json("Could not get polls.");
  }
};

exports.getPoll = async (req, res) => {
  try {
    // Extract request data
    const { pollId } = req.params;

    // Retrieve poll with user and options
    const poll = await models.Poll.findOne({
      where: { id: pollId },
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

    // Throw error if poll not found
    if (!poll) {
      return res.status(400).json("Poll not found.");
    }

    res.json({ poll });
  } catch (error) {
    console.log(error);
    res.status(400).json("Could not get poll.");
  }
};

exports.createPoll = async (req, res) => {
  try {
    // Extract request data
    const userId = req.user.id;
    const { options, ...rest } = req.body;

    // Create poll
    let poll = await models.Poll.create({ ...rest, userId });
    const pollId = poll.get("id");

    // Create options
    await Promise.all(
      options.map(async (option) => {
        await models.Option.create({ ...option, pollId });
      })
    );

    // Retrieve poll with user and options
    poll = await models.Poll.findOne({
      where: { id: pollId },
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
    res.status(400).json("Could not create poll.");
  }
};
