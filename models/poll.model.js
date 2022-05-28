const getPollModel = (sequelize, { DataTypes }) => {
  const Poll = sequelize.define("poll", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  const include = (models, config) => ({
    ...config,
    include: [
      { model: models.User, as: "user", attributes: ["username"] },
      {
        model: models.Option,
        as: "options",
        attributes: ["uuid", "content"],
        include: [
          {
            model: models.Vote,
            as: "votes",
            attributes: ["country", "countryCode"],
          },
        ],
      },
    ],
    nest: true,
  });

  Poll.getAll = async (models) => {
    const poll = await Poll.findAll(include(models, {}));
    return poll;
  };

  Poll.getOne = async (models, id) => {
    const poll = await Poll.findOne(include(models, { where: { id } }));
    return poll;
  };

  Poll.associate = (models) => {
    Poll.belongsTo(models.User);
    Poll.hasMany(models.Option, { onDelete: "CASCADE" });
  };

  return Poll;
};

module.exports = { getPollModel };
