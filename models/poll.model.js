const getPollModel = (sequelize, { DataTypes }) => {
  const Poll = sequelize.define("poll", {
    question: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Poll.associate = (models) => {
    Poll.belongsTo(models.User);
  };

  return Poll;
};

module.exports = { getPollModel };
