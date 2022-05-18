const getOptionModel = (sequelize, { DataTypes }) => {
  const Option = sequelize.define("option", {
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Option.associate = (models) => {
    Option.hasMany(models.Vote, { onDelete: "CASCADE" });
    Option.belongsTo(models.Poll);
  };

  return Option;
};

module.exports = { getOptionModel };
