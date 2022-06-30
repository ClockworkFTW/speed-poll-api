const { v5: uuidv5 } = require("uuid");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");
const countries = require("i18n-iso-countries");
const opentdbService = require("../services/opentdb");

const { models } = require("../models");

// Constants
const USER_COUNT = 20;
const POLL_COUNT = 50;
const VOTE_COUNT = 1000;

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

module.exports = async () => {
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
  const polls = await Promise.all(
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

      return {
        ...poll.get(),
        options: [...question.incorrect_answers, question.correct_answer],
      };
    })
  );

  // Create options
  const options = await Promise.all(
    polls.map(async (poll) => {
      const options = await Promise.all(
        poll.options.map(async (content, index) => {
          const option = await models.Option.create({
            pollId: poll.id,
            index,
            content,
            color: colors[Math.floor(Math.random() * colors.length)],
          });

          return option.get();
        })
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

  // Create comments
  const comments = await Promise.all(
    polls.map(async (poll) => {
      const comments = await Promise.all(
        [...Array(Math.floor(Math.random() * 5))].map(async () => {
          // Initialize data
          const userId = users[Math.floor(Math.random() * USER_COUNT)].id;
          const createdAt = faker.date.recent(10);
          const text = faker.lorem.sentence();

          // Create comment
          const comment = await models.Comment.create({
            pollId: poll.id,
            userId,
            createdAt,
            text,
          });

          return comment.get();
        })
      );

      return comments;
    })
  );

  // Create child comments
  const createChildComment = async (parentComment, count) => {
    if (count === 0) return;

    // Initialize data
    const { pollId } = parentComment;
    const parentId = parentComment.id;
    const userId = users[Math.floor(Math.random() * USER_COUNT)].id;
    const createdAt = faker.date.recent(10);
    const text = faker.lorem.sentence();

    // Create child comment
    const childComment = await models.Comment.create({
      parentId,
      userId,
      pollId,
      createdAt,
      text,
    });

    // Update parent comments childId
    await models.Comment.update(
      { childId: childComment.id },
      { where: { id: parentId } }
    );

    // Recursive call
    createChildComment(childComment, count - 1);
  };

  await Promise.all(
    comments.flat().map(async (comment) => {
      await createChildComment(comment, Math.floor(Math.random() * 5));
    })
  );
};
