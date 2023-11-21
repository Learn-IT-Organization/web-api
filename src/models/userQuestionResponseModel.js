import DataTypes from "sequelize";
import pkg from "../../config/database.cjs";
const { sequelize } = pkg;

const UserQuestionResponse = sequelize.define(
  'user_question_response',
  {
    uqr_question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    uqr_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    response: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    is_correct: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    response_time: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
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

    QuestionsAnswers.belongsTo(models.Users, {
      foreignKey: "uqr_user_id",
      targetKey: "user_id",
      onDelete: "CASCADE",
    });
};

export default UserQuestionResponse;