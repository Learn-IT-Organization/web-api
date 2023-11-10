import express from 'express';
import pkg from '../config/database.cjs';
const { sequelize } = pkg; 

import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js'; 
import chapterRoutes from './routes/chapterRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';
import questionsAnswersRoutes from './routes/questionsAnswersRoutes.js'
import lessonContentRoutes from './routes/lessonContentRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();
const port = 3306;

app.use(express.json());

app.use('/', userRoutes);
app.use('/', courseRoutes);
app.use('/', chapterRoutes);
app.use('/', lessonRoutes);
app.use('/', questionsAnswersRoutes);
app.use('/', lessonContentRoutes);

app.use(errorMiddleware);

sequelize.sync();
console.log('Database synchronized');

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
