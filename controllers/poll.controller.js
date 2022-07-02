const { models } = require("../models");

const geolocationService = require("../services/geolocation");

exports.getPolls = async (req, res) => {
  try {
    const polls = await models.Poll.getAll(req.models);

    res.json({ polls });
  } catch (error) {
    console.log("getPolls", error.name);
    res.status(400).json("Could not get polls.");
  }
};

exports.getPoll = async (req, res) => {
  try {
    // Extract request data
    const { pollId } = req.params;
    const ip = req.clientIp;

    // Create view
    const views = await models.View.findAll({ where: { pollId }, raw: true });

    if (!views.find((view) => view.ip === ip)) {
      const { country, countryCode } = await geolocationService.getLocation(ip);
      await models.View.create({ pollId, ip, country, countryCode });
    }

    // Get poll
    const poll = await models.Poll.getOne(req.models, pollId);

    if (!poll) {
      return res.status(400).json("Poll not found.");
    }

    res.json({ poll });
  } catch (error) {
    console.log("getPoll", error.name);
    res.status(400).json("Could not get poll.");
  }
};

exports.getLivePoll = async (req, res) => {
  try {
    // Set response headers
    res.set({
      "Cache-Control": "no-cache",
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
    });

    // Flush headers and init counter
    res.flushHeaders();
    let count = 0;

    const interval = setInterval(async () => {
      // Close connection after 5 minutes
      if (count === 300) {
        clearInterval(interval);
        return res.end();
      }

      // Get poll and send to client
      const poll = await models.Poll.getOne(req.models, req.params.pollId);
      res.write(`data: ${JSON.stringify(poll)} \n\n`);

      // Increment counter
      count++;
    }, 1000);

    // Close connection on client close
    res.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  } catch (error) {
    console.log("getLivePoll", error.name);
    res.status(400).json("Could not get poll.");
  }
};

exports.createPoll = async (req, res) => {
  try {
    // Extract request data
    const userId = req.user.id;
    const { question, options, settings } = req.body;
    const { setEndDate, endDate, ...otherSettings } = settings;

    // Create poll
    let poll = await models.Poll.create({
      ...otherSettings,
      endDate: setEndDate ? endDate : null,
      question,
      userId,
    });
    const pollId = poll.get("id");

    // Create options
    await Promise.all(
      options.map(async (option, index) => {
        await models.Option.create({ ...option, index, pollId });
      })
    );

    // Retrieve poll with user and options
    poll = await models.Poll.getOne(req.models, pollId);

    res.json({ poll });
  } catch (error) {
    console.log("createPoll", error.name);
    res.status(400).json("Could not create poll.");
  }
};
