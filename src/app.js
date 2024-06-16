import express from "express";
import database from "../config/database.cjs";
import { config } from "../config/config.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import questionsAnswersRoutes from "./routes/questionsAnswersRoutes.js";
import lessonContentRoutes from "./routes/lessonContentRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import userQuestionResponseRoutes from "./routes/userQuestionResponsesRoutes.js";
import teacherRoutes from "./routes/teacherRequestRoutes.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(cookieParser());

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

app.use("/", userRoutes);
app.use("/", courseRoutes);
app.use("/", chapterRoutes);
app.use("/", lessonRoutes);
app.use("/", questionsAnswersRoutes);
app.use("/", lessonContentRoutes);
app.use("/", userQuestionResponseRoutes);
app.use("/", teacherRoutes);

app.use(errorMiddleware);

const { sequelize } = database;
sequelize.sync();
console.log("Database synchronized");

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
