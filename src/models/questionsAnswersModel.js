import DataTypes, { Model } from "sequelize";
import pkg from "../../config/database.cjs";
const { sequelize } = pkg;

const QuestionsAnswers = sequelize.define(
  "questions_answers",
  {
    question_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    qa_lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    question_text: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    question_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    qa_chapter_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    qa_course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

QuestionsAnswers.associate = (models) => {
  QuestionsAnswers.belongsTo(models.Lesson, {
    foreignKey: "qa_lesson_id",
    targetKey: "lesson_id",
  });

  QuestionsAnswers.belongsTo(models.Chapter, {
    foreignKey: "qa_chapter_id",
    targetKey: "chapter_id",
  });

  QuestionsAnswers.belongsTo(models.Course, {
    foreignKey: "qa_course_id",
    targetKey: "course_id",
  });

  QuestionsAnswers.hasMany(models.UserQuestionResponse, {
    foreignKey: "uqr_question_id",
  });
};

export default QuestionsAnswers;
