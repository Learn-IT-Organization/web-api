import express from 'express';
import database from '../config/database.cjs';
import { config } from '../config/config.js';
const { sequelize } = database; 
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js'; 
import chapterRoutes from './routes/chapterRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import questionsAnswersRoutes from './routes/questionsAnswersRoutes.js'
import lessonContentRoutes from './routes/lessonContentRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import registerRoutes from './routes/registerRoutes.js';
import logoutRoutes from './routes/logoutRoutes.js';
import editUserRoutes from './routes/editUserRoutes.js';
import cookieParser from 'cookie-parser'; 

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/', loginRoutes);
app.use('/', userRoutes);
app.use('/', courseRoutes);
app.use('/', chapterRoutes);
app.use('/', lessonRoutes);
app.use('/', questionsAnswersRoutes);
app.use('/', lessonContentRoutes);
app.use('/', registerRoutes);
app.use(errorMiddleware);
app.use('/', logoutRoutes);
app.use('/', editUserRoutes);

sequelize.sync();
console.log('Database synchronized');

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
