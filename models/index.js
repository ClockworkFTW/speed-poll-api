const Sequelize = require("sequelize");

const { getUserModel } = require("./user.model");
const { getPollModel } = require("./poll.model");
const { getOptionModel } = require("./option.model");
const { getVoteModel } = require("./vote.model");
const { getViewModel } = require("./view.model");
const { getCommentModel } = require("./comment.model");

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "postgres",
    dialectOptions: process.env.NODE_ENV === "production" && {
      ssl: {
        require: true,
        rejectUnauthorized: false,
        ca: process.env.DATABASE_CA_CERT,
      },
    },
    logging: false,
  }
);

const models = {
  User: getUserModel(sequelize, Sequelize),
  Poll: getPollModel(sequelize, Sequelize),
  Option: getOptionModel(sequelize, Sequelize),
  Vote: getVoteModel(sequelize, Sequelize),
  View: getViewModel(sequelize, Sequelize),
  Comment: getCommentModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { models, sequelize };
