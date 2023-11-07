import DataTypes from 'sequelize';
import pkg from '../../config/database.cjs';
const { sequelize } = pkg;

const Course = sequelize.define('courses', {
    course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true, 
        allowNull: false,
        autoIncrement: true, 
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

Course.associate = (models) => {
    Course.hasMany(models.Chapter, {
        foreignKey: 'chapter_course_id',
        onDelete: 'CASCADE',
    });
}

export default Course;
