const { models } = require("../models");

exports.createComment = async (req, res) => {
  try {
    // Extract request data
    const userId = req.user.id;
    const { pollId, parentId, text } = req.body;

    await models.Comment.create({ userId, pollId, parentId, text });

    res.status(200).end();
  } catch (error) {
    console.log("createComment", error);
    res.status(400).json("Could not create comment.");
  }
};
