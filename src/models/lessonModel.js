import DataTypes from 'sequelize';
import pkg from '../../config/database.cjs';
const { sequelize } = pkg;
import Chapters from 'chapterModel.js';

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
        chapter_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        lesson_sequence_number: {
            type: DataTypes.INTEGER    ,
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
        }
    },
    {
        timestamps: false,
    });

Lessons.belongsTo(Chapters, { foreignKey: 'chapter_id' });
export default Lessons;
