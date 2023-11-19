import LessonContent from "../models/lessonContentModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";

const createLessonContent = async (req, res) => {
  try {
    const lessonContent = await LessonContent.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(lessonContent);
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
    res.status(HTTP_STATUS_CODES.NOT_FOUND).json({});
  }
};

export { 
    createLessonContent, 
    getAllLessonContents, 
    getLessonContentById 
};
