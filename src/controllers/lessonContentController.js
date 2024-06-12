import LessonContent from "../models/lessonContentModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { RecordNotFoundError } from "../constants/errors.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const createLessonContent = async (req, res) => {
  try {
    const lessonContent = await LessonContent.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json({
      success: true,
      message: "Lesson content created successfully",
      lessonId: lessonContent.content_lesson_id,
      contentId: lessonContent.content_id,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllLessonContents = async (req, res) => {
  const lessonContent = await LessonContent.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(lessonContent);
};

const getLessonContentById = async (req, res) => {
  const lessonContentId = req.params.id;
  const lessonContent = await LessonContent.findByPk(lessonContentId);
  if (lessonContent != null) {
    res.status(HTTP_STATUS_CODES.CREATED).json(lessonContent);
  } else {
    const error = new RecordNotFoundError(lessonContentId);
    res.status(error.statusCode).json(error.toJSON());
  }
};

const editLessonContent = async (req, res) => {
  const { id } = req.params;
  const { url, content_title, content_description } = req.body;

  try {
    const lessonContent = await LessonContent.findByPk(id);

    if (!lessonContent) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Lesson Content not found" });
    }

    if (url !== undefined) {
      lessonContent.url = url;
    }
    if (content_title !== undefined) {
      lessonContent.content_title = content_title;
    }
    if (content_description !== undefined) {
      lessonContent.content_description = content_description;
    }

    await lessonContent.save();
    return res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      message: "Lesson Content updated successfully",
      lessonId: lessonContent.lesson_id,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ success: false, message: error.message });
  }
};

const deleteLessonContent = async (req, res) => {
  const { id } = req.params;

  try {
    const lessonContent = await LessonContent.findByPk(id);

    if (!lessonContent) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Lesson Content not found" });
    }

    await lessonContent.destroy();
    return res.status(HTTP_STATUS_CODES.OK).json({
      success: true,
      message: "Lesson Content deleted successfully",
      lessonId: lessonContent.content_lesson_id,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

export {
  createLessonContent,
  getAllLessonContents,
  getLessonContentById,
  editLessonContent,
  deleteLessonContent,
};
