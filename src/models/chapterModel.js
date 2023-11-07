import { DataTypes } from 'sequelize';
import pkg from '../../config/database.cjs';
const { sequelize } = pkg;

const Chapter = sequelize.define('chapters', {
    chapter_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true, 
    },
    chapter_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    chapter_description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    chapter_sequence_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false, 
});

Chapter.associate = (models) => {   
    Chapter.hasMany(models.Lesson, {
        foreignKey: 'lesson_chapter_id',
        onDelete: 'CASCADE',
    });

    Chapter.belongsTo(models.Course, {
        foreignKey: 'course_id',
    });
}

export default Chapter;