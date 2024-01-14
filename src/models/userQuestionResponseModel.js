import DataTypes from "sequelize";
import pkg from "../../config/database.cjs";
const { sequelize } = pkg;

const UserQuestionResponse = sequelize.define(
  "user_question_responses",
  {
    response_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    uqr_question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    uqr_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    response: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    response_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

UserQuestionResponse.associate = (models) => {
  UserQuestionResponse.belongsTo(models.QuestionsAnswers, {
    foreignKey: "uqr_question_id",
    targetKey: "question_id",
    onDelete: "CASCADE",
  });

  UserQuestionResponse.belongsTo(models.Users, {
    foreignKey: "uqr_user_id",
    targetKey: "user_id",
    onDelete: "CASCADE",
  });
};

export default UserQuestionResponse;
