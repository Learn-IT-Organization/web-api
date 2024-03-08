import DataTypes from "sequelize";
import pkg from "../../config/database.cjs";
const { sequelize } = pkg;

const Tokens = sequelize.define(
  "tokens",
  {
    token_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    token_name: {
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

export default Tokens;
