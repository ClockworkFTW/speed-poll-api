const getViewModel = (sequelize, { DataTypes }) => {
  const View = sequelize.define("view", {
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
  });

  View.associate = (models) => {
    View.belongsTo(models.Poll, { foreignKey: { allowNull: false } });
  };

  return View;
};

module.exports = { getViewModel };
