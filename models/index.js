const Sequelize = require("sequelize");

const { getUserModel } = require("./user.model");
const { getPollModel } = require("./poll.model");

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: "postgres",
    logging: false,
  }
);

const models = {
  User: getUserModel(sequelize, Sequelize),
  Poll: getPollModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

module.exports = { models, sequelize };
