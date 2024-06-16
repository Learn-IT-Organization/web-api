import DataTypes from "sequelize";
import pkg from "../../config/database.cjs";
const { sequelize } = pkg;

const UserLessonProgress = sequelize.define(
  "user_lesson_progress",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      primaryKey: true,
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      primaryKey: true,
    },
    lesson_score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    is_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
  }
);

export default UserLessonProgress;
