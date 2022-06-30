const getCommentModel = (sequelize, { DataTypes }) => {
  const Comment = sequelize.define("comment", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { onDelete: "CASCADE" });
    Comment.belongsTo(models.Poll, { onDelete: "CASCADE" });
    Comment.belongsTo(models.Comment, { as: "parent" });
    Comment.hasOne(models.Comment, { as: "child" });
  };

  return Comment;
};

module.exports = { getCommentModel };
