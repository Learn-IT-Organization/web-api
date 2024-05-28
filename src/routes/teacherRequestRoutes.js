import { Router } from "express";
import {
  validateTeacherRequest,
  createRequest,
  getAllRequests,
  declineTeacherRequest,
  getRequestsByUserId,
} from "../controllers/teacherRequestController.js";
import {
  validateAdmin,
  validateStudent,
} from "../middleware/roleMiddleware.js";

const router = Router();

router.post("/validateTeacher", validateAdmin, validateTeacherRequest);

router.post("/createRequest", validateStudent, createRequest);

router.get("/teacherRequests", validateAdmin, getAllRequests);

router.post("/declineRequest", validateAdmin, declineTeacherRequest);

router.get("/userRequests", getRequestsByUserId);

export default router;
