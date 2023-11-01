import express from 'express';
import pkg from '../config/database.cjs';
const { sequelize } = pkg; 
import courseRoutes from './routes/courseRoutes.js'; 

const app = express();
const port = 3000;

app.use(express.json());

app.use('/', courseRoutes);

sequelize.sync = async () => {
  await sequelize.sync();
  console.log('Database synchronized');
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
