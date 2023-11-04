import express from 'express';
import pkg from '../config/database.cjs';
const { sequelize } = pkg; 
import courseRoutes from './routes/courseRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
<<<<<<< HEAD
import lessonRoutes from './routes/lessonRoutes.js';
=======
import chapterRoutes from './routes/chapterRoutes.js';
>>>>>>> f49d8751f54ede8e97a6df85591edaf4311236b8

const app = express();
const port = 3306;

app.use(express.json());

app.use('/', courseRoutes);
app.use('/', userRoutes);
<<<<<<< HEAD
app.use('/', lessonRoutes);
=======
app.use('/', chapterRoutes);
>>>>>>> f49d8751f54ede8e97a6df85591edaf4311236b8

sequelize.sync = async () => {
  await sequelize.sync();
  console.log('Database synchronized');
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
