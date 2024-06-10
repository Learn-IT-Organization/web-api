import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import LessonContent from "../models/lessonContentModel.js";
import Lessons from "../models/lessonModel.js";
import { RecordNotFoundError } from "../constants/errors.js";

const createLesson = async (req, res) => {
  try {
    const lesson = await Lessons.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json({ 
      success: true, 
      message: "Lesson created successfully", 
      lessonId: lesson.lesson_id,
      userId: lesson.lesson_user_id,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllLessons = async (req, res) => {
  const lessons = await Lessons.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(lessons);
};

const editLesson = async (req, res) => {
  const { id } = req.params;
  const { lesson_name, lesson_description, lesson_type, lesson_tags} =
    req.body;

  try {
    const lesson = await Lessons.findByPk(id);

    if (!lesson) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Lesson not found" });
    }

    if (lesson_name !== undefined) {
      lesson.lesson_name = lesson_name;
    }
    if (lesson_description !== undefined) {
      lesson.lesson_description = lesson_description;
    }
    if (lesson_type !== undefined) {
      lesson.lesson_type = lesson_type;
    }
    if (lesson_tags !== undefined) {
      lesson.lesson_tags = lesson_tags;
    }
  
    await lesson.save();
    return res
      .status(HTTP_STATUS_CODES.OK)
      .json({
        success: true,
        message: "Lesson updated successfully",
        lessonId: lesson.lesson_id,
        userId: lesson.lesson_user_id,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const getLessonById = async (req, res) => {
  const lessonId = req.params.id;
  const lesson = await Lessons.findByPk(lessonId);

  if (lesson != null) {
    const maxDescriptionLength = 60;

    if (lesson.dataValues.lesson_description.length > maxDescriptionLength) {
      lesson.dataValues.lesson_description = lesson.lesson_description.substring(0, maxDescriptionLength) + "...";
    }

    res.status(HTTP_STATUS_CODES.OK).json(lesson);
  } else {
    const error = new RecordNotFoundError(lessonId);
    res.status(error.statusCode).json(error.toJSON());
  }
};

const deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
      const lesson = await Lessons.findByPk(id);

      if (!lesson) {
          return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
              success: false,
              message: 'Lesson not found'
          });
      }

      await lesson.destroy();

      return res.status(HTTP_STATUS_CODES.OK).json({
          success: true,
          message: 'Lesson deleted successfully'
      });
  } catch (error) {
      console.error('Error deleting lesson:', error);
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error'
      });
  }
};

const getContentsByLessonId = async (req, res) => {
  const lessonId = req.params.lessonId;
  const contents = await LessonContent.findAll({
    where: {
      content_lesson_id: lessonId,
    },
  });
  res.status(HTTP_STATUS_CODES.OK).json(contents);
};

export {
  createLesson,
  getAllLessons,
  getLessonById,
  getContentsByLessonId,
  editLesson,
  deleteLesson
};
