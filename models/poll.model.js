const getPollModel = (sequelize, { DataTypes }) => {
  const Poll = sequelize.define("poll", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    privatePoll: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    allowMultipleVotes: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    addComments: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    loginToVote: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hideResults: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    enableCaptcha: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  const include = (models, config) => ({
    ...config,
    include: [
      { model: models.User, as: "user", attributes: ["id", "username"] },
      {
        model: models.Option,
        as: "options",
        attributes: ["id", "index", "content", "color"],
        include: [
          {
            model: models.Vote,
            as: "votes",
            attributes: ["country", "countryCode", "createdAt"],
          },
        ],
      },
      { model: models.View, as: "views", attributes: ["ip"] },
      {
        model: models.Comment,
        as: "comments",
        attributes: ["id", "text", "createdAt", "parentId", "childId"],
        include: {
          model: models.User,
          as: "user",
          attributes: ["id", "username"],
        },
      },
    ],
    nest: true,
  });

  Poll.getAll = async (models) => {
    const polls = await Poll.findAll(include(models, {}));
    return polls;
  };

  Poll.getOne = async (models, id) => {
    const poll = await Poll.findOne(include(models, { where: { id } }));
    return poll;
  };

  Poll.associate = (models) => {
    Poll.belongsTo(models.User);
    Poll.hasMany(models.Option, { onDelete: "CASCADE" });
    Poll.hasMany(models.Comment, { onDelete: "CASCADE" });
    Poll.hasMany(models.View, {
      onDelete: "CASCADE",
      foreignKey: { allowNull: false },
    });
  };

  return Poll;
};

module.exports = { getPollModel };
