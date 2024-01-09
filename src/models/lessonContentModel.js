import DataTypes from 'sequelize';
import pkg from '../../config/database.cjs';
const { sequelize } = pkg;

const LessonContent = sequelize.define('lesson_contents', {
    content_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        validate: {
            notEmpty: true,
        }
    },
    content_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    attachments: {
        type: DataTypes.BLOB,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    content_course_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    content_chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    content_lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    }
},
{
    timestamps: false,
});

LessonContent.associate = (models) => {
    Content.belongsTo(models.Lessons, {
        foreignKey: 'content_lesson_id',
        onDelete: 'CASCADE',
    });

    Content.belongsTo(models.Chapters, {
        foreignKey: 'content_chapter_id',
        onDelete: 'CASCADE',
    });

    Content.belongsTo(models.Courses, {
        foreignKey: 'content_course_id',
        onDelete: 'CASCADE',
    })
};

export default LessonContent;
