import DataTypes from 'sequelize';
import pkg from '../../config/database.cjs';
const { sequelize } = pkg;

const Lessons = sequelize.define('lessons', {
    lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        validate: {
            notEmpty: true,
        }
    },
    lesson_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    lesson_chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    lesson_sequence_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    lesson_description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        unique: true
    },
    lesson_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    lesson_tags : {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
},
{
    timestamps: false,
});

Lessons.associate = (models) => {
    Lessons.belongsTo(models.Chapter, {
        foreignKey: 'lesson_chapter_id',
        onDelete: 'CASCADE',
    });
  
    Lessons.hasMany(models.LessonContent, {
        foreignKey: 'content_lesson_id',
        onDelete: 'CASCADE',
    });
  
    Lessons.hasMany(models.QuestionsAnswers, {
        foreignKey: 'qa_lesson_id',
        onDelete: 'CASCADE',
    });
};

export default Lessons;
