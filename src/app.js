import express from 'express';
import pkg from '../config/database.cjs';
const { sequelize } = pkg; 

import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js'; 
import chapterRoutes from './routes/chapterRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';

const app = express();
const port = 3306;

app.use(express.json());

app.use('/', userRoutes);
app.use('/', courseRoutes);
app.use('/', chapterRoutes);
app.use('/', lessonRoutes);

sequelize.sync = async () => {
  await sequelize.sync();
  console.log('Database synchronized');
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
