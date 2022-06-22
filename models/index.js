const Sequelize = require("sequelize");

const { getUserModel } = require("./user.model");
const { getPollModel } = require("./poll.model");
const { getOptionModel } = require("./option.model");
const { getVoteModel } = require("./vote.model");

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
  Option: getOptionModel(sequelize, Sequelize),
  Vote: getVoteModel(sequelize, Sequelize),
};

Object.keys(models).forEach((key) => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

// Seed database
const { v5: uuidv5, v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const countries = require("i18n-iso-countries");
const opentdbService = require("../services/opentdb");

const colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
];

const seed = async () => {
  // Constants
  const USER_COUNT = 20;
  const POLL_COUNT = 50;
  const VOTE_COUNT = 1000;

  // Create users
  const users = await Promise.all(
    [...Array(USER_COUNT)].map(async () => {
      // Initialize data
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email(firstName, lastName);
      const username = `${firstName} ${lastName}`;
      const password = await bcrypt.hash(faker.internet.password(), 10);
      const uuid = uuidv5(email, process.env.UUID_NAMESPACE);
      const source = "local";

      // Create user
      const user = await models.User.create({
        uuid,
        username,
        email,
        password,
        source,
      });

      return user;
    })
  );

  // Get questions from open trivia database
  const questions = await opentdbService.getQuestions(POLL_COUNT);

  // Create polls
  const options = await Promise.all(
    questions.map(async (question) => {
      // Initialize data
      const userId = users[Math.floor(Math.random() * USER_COUNT)].id;
      const createdAt = faker.date.recent(10);

      // Create poll
      const poll = await models.Poll.create({
        userId,
        createdAt,
        question: question.question,
      });

      // Create options
      const options = await Promise.all(
        [...question.incorrect_answers, question.correct_answer].map(
          async (content, index) => {
            const option = await models.Option.create({
              pollId: poll.get("id"),
              index,
              content,
              color: colors[Math.floor(Math.random() * colors.length)],
            });

            return option.get();
          }
        )
      );

      return options;
    })
  );

  // Create votes
  await Promise.all(
    [...Array(VOTE_COUNT)].map(async () => {
      // Initialize data
      const optionId =
        options.flat()[Math.floor(Math.random() * options.flat().length)].id;
      const ip = faker.internet.ipv4();
      const countryCode = faker.address.countryCode();
      const country = countries.getName(countryCode, "en");

      // Create vote
      await models.Vote.create({
        optionId,
        ip,
        country,
        countryCode,
      });
    })
  );
};

module.exports = { models, sequelize, seed };
