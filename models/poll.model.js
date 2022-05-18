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

  Poll.associate = (models) => {
    Poll.belongsTo(models.User);
    Poll.hasMany(models.Option, { onDelete: "CASCADE" });
  };

  return Poll;
};

module.exports = { getPollModel };
