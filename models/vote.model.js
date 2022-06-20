const getVoteModel = (sequelize, { DataTypes }) => {
  const Vote = sequelize.define("vote", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Vote.associate = (models) => {
    Vote.belongsTo(models.Option, { foreignKey: { allowNull: false } });
  };

  return Vote;
};

module.exports = { getVoteModel };
