import DataTypes from "sequelize";
import pkg from "../../config/database.cjs";
const { sequelize } = pkg;

const UserScore = sequelize.define(
  "user_scores",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    response_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    total_score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

UserScore.associate = (models) => {
  UserScore.belongsTo(models.User, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
  });

  UserScore.belongsTo(models.UserQuestionResponse, {
    foreignKey: "response_id",
    onDelete: "CASCADE",
  });
};

export default UserScore;
