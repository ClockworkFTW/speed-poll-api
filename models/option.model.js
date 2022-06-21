const getOptionModel = (sequelize, { DataTypes }) => {
  const Option = sequelize.define("option", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
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
    Option.hasMany(models.Vote, {
      onDelete: "CASCADE",
      foreignKey: { allowNull: false },
    });
    Option.belongsTo(models.Poll);
  };

  return Option;
};

module.exports = { getOptionModel };
