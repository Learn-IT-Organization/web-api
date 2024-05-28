import Chapter from "../models/chapterModel.js";
import Lessons from "../models/lessonModel.js";
import Tokens from "../models/tokensModel.js";
import HTTP_STATUS_CODES from "../constants/httpStatusCodes.js";
import { RecordNotFoundError } from "../constants/errors.js";
import admin from 'firebase-admin';

const sendToken = async (req, res) => {
  try {
    const token = await Tokens.create(req.body);
    res.status(HTTP_STATUS_CODES.CREATED).json(token);
  } catch (error) {
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
}

const getAllTokens = async (req, res) => {
  const tokens = await Tokens.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(tokens);
}

const createChapter = async (req, res) => {
  try {  
    const chapter = await Chapter.create(req.body);

    const currentDate = new Date(Date.now());
    console.log('Current date:', currentDate);

    const message = {
      data: {
        isNewChapter: 'true',
      },
      notification: {
        title: 'New chapter added!',
        body: req.body.chapter_name + ' chapter has been added to the course at ' + currentDate,
      },
    };

    const tokens = await Tokens.findAll();
    const tokenNames = tokens.map(token => token.token_name);
    await admin.messaging().sendToDevice(tokenNames, message);

    res.status(HTTP_STATUS_CODES.CREATED).json({ 
      success: true, 
      message: "Chapter created successfully", 
      chapterId: chapter.chapter_id
    });
    } catch (error) {
    console.error('Error creating chapter or sending push notification:', error);
    res.status(HTTP_STATUS_CODES.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllChapters = async (req, res) => {
  const chapters = await Chapter.findAll();
  res.status(HTTP_STATUS_CODES.OK).json(chapters);
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
};
