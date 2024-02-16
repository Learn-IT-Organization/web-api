import LessonContent from "../models/lessonContentModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { RecordNotFoundError } from "../constants/errors.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const createLessonContent = async (req, res) => {
//   try {
//     upload.single('attachments')(req, res, async (err) => {
//       if (err) {
//         return res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Error uploading file.' });
//       }

//       try {
//         const { content_type, url, content_course_id, content_chapter_id, content_lesson_id } = req.body;
//         const attachments = req.file.buffer; 

//         const newLessonContent = await LessonContent.create({
//           content_type,
//           url,
//           attachments,
//           content_course_id,
//           content_chapter_id,
//           content_lesson_id,
//         });
//         res.status(HTTP_STATUS_CODES.CREATED).json(newLessonContent);
//       } catch (error) {
//         res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: 'Error uploading file.' });
//       }
//     });
//   } catch (error) {
//     res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
//   }
// };

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
    const error = new RecordNotFoundError(lessonContentId);
    res.status(error.statusCode).json(error.toJSON());
  }
};

export { createLessonContent, getAllLessonContents, getLessonContentById,  };