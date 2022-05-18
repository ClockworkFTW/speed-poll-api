const getVoteModel = (sequelize, { DataTypes }) => {
  const Vote = sequelize.define("vote", {
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Vote.associate = (models) => {
    Vote.belongsTo(models.Option);
  };

  return Vote;
};

module.exports = { getVoteModel };
