import Chapter from "../models/chapterModel.js";
import Lessons from "../models/lessonModel.js";
import Tokens from "../models/tokensModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { RecordNotFoundError } from "../constants/errors.js";
import admin from "firebase-admin";

const sendToken = async (req, res) => {
  try {
    const token = await Tokens.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(token);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllTokens = async (req, res) => {
  const tokens = await Tokens.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(tokens);
};

const createChapter = async (req, res) => {
  try {
    const chapter = await Chapter.create(req.body);

    const currentDate = new Date(Date.now());
    console.log("Current date:", currentDate);

    const message = {
      data: {
        isNewChapter: "true",
      },
      notification: {
        title: "New chapter added!",
        body:
          req.body.chapter_name +
          " chapter has been added to the course at " +
          currentDate,
      },
    };

    const tokens = await Tokens.findAll();
    const tokenNames = tokens.map((token) => token.token_name);
    await admin.messaging().sendToDevice(tokenNames, message);

    res.status(HTTP_STATUS_CODES.CREATED).json({
      success: true,
      message: "Chapter created successfully",
      chapterId: chapter.chapter_id,
      userId: chapter.chapter_user_id,
    });
  } catch (error) {
    console.error(
      "Error creating chapter or sending push notification:",
      error
    );
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllChapters = async (req, res) => {
  const chapters = await Chapter.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(chapters);
};

const editChapter = async (req, res) => {
  const { id } = req.params;
  const { chapter_name, chapter_description, chapter_sequence_number } =
    req.body;

  try {
    const chapter = await Chapter.findByPk(id);

    if (!chapter) {
      return res
        .status(HTTP_STATUS_CODES.NOT_FOUND)
        .json({ error: "Chapter not found" });
    }

    if (chapter_name !== undefined) {
      chapter.chapter_name = chapter_name;
    }
    if (chapter_description !== undefined) {
      chapter.chapter_description = chapter_description;
    }
    await chapter.save();
    return res
      .status(HTTP_STATUS_CODES.OK)
      .json({
        success: true,
        message: "Chapter updated successfully",
        chapterId: chapter.chapter_id,
        userId: chapter.chapter_user_id,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deleteChapter = async (req, res) => {
  const { id } = req.params;

  try {
      const chapter = await Chapter.findByPk(id);

      if (!chapter) {
          return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
              success: false,
              message: 'Chapter not found'
          });
      }

      await chapter.destroy();

      return res.status(HTTP_STATUS_CODES.OK).json({
          success: true,
          message: 'Chapter deleted successfully'
      });
  } catch (error) {
      console.error('Error deleting chapter:', error);
      return res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'Internal server error'
      });
  }
};

const getChapterById = async (req, res) => {
  const chapterId = req.params.id;
  const chapter = await Chapter.findByPk(chapterId);
  if (chapter) {
    res.status(HTTP_STATUS_CODES.OK).json(chapter);
  } else {
    const error = new RecordNotFoundError(chapterId);
    res.status(error.statusCode).json(error.toJSON());
  }
};

const getLessonsByChapterId = async (req, res) => {
  const chapterId = req.params.chapterId;
  const lessons = await Lessons.findAll({
    where: {
      lesson_chapter_id: chapterId,
    },
  });
  res.status(HTTP_STATUS_CODES.OK).json(lessons);
};

export {
  createChapter,
  sendToken,
  getAllTokens,
  getAllChapters,
  getChapterById,
  getLessonsByChapterId,
  editChapter,
  deleteChapter
};
