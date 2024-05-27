import DataTypes, { Model } from "sequelize";
import pkg from "../../config/database.cjs";
import e from "express";
const { sequelize } = pkg;

const TeacherRequest = sequelize.define(
  "teacher_request",
  {
    request_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    request_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        notEmpty: true,
      },
    },
    is_approved: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    timestamps: false,
  }
);

TeacherRequest.async = (models) => {
  TeacherRequest.belongsTo(models.Users, {
    foreignKey: "user_id",
    targetKey: "user_id",
    onDelete: "CASCADE",
  });
};

export default TeacherRequest;
