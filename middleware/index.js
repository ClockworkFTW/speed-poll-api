const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const { models } = require("../models");

exports.validateToken = async (req, res, next) => {
  try {
    if (!req.headers.cookie) {
      return res.status(200).end();
    }

    const { token } = cookie.parse(req.headers.cookie);
    const uuid = jwt.verify(token, process.env.JWT_SECRET);

    const user = await models.User.findOne({
      where: { uuid },
      attributes: ["uuid", "username"],
      raw: true,
    });

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json("Invalid token");
  }
};
