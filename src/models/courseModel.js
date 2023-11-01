import DataTypes from 'sequelize';
import pkg from '../../config/database.cjs';
const { sequelize } = pkg;

const Course = sequelize.define('courses', {
    course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
    },
    course_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    create_date: {
        type: DataTypes.DATE,
        allowNull: false,

    },
    programming_language: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course_description: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false, 
});

export default Course;
