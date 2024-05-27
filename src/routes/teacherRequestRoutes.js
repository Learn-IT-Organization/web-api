import { Router } from "express";
import { validateTeacherRequest } from "../controllers/teacherRequestController.js";
import { validateAdmin } from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/validateTeacher", validateAdmin, validateTeacherRequest);

export default router;
